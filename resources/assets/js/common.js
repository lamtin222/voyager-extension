// ------------------------------
// Translate
// ------------------------------
var trans = function(key, replace = {})
{
    var translation = key.split('.').reduce((t, i) => t[i] || null, window.translations);

    for (var placeholder in replace) {
        translation = translation.replace(`:${placeholder}`, replace[placeholder]);
    }
    return translation;
}

// ------------------------------
// Set Request parameters to use with AJAX
// el = jQuery object with data vars;
// ------------------------------
var getMediaParams = function (el)
{
    return {
        type:     el.data('type'),
        model:    el.data('model'),
        slug:     el.data('slug'),
        id:       el.data('id'),
        field  :  el.data('field-name'),
        media_file_id: el.data('file-id'),
        media_ids: [el.data('image-id')],
        filename: el.data('file-name'),
        _token:   csrf_token
    }
}

// ------------------------------
// Returns Dialog position closest to cursor
// evt = Event
// extra = if True - Dialog has extra fields
// ------------------------------
var getDialogPosition = function (evt, extra, offs = 0)
{
    var w_width = $(window).width();
    var w_height = $(window).height();
    var pos = {x: null, y: null};

    var x_offs = (w_width - evt.screenX < 200) ? evt.screenX - 200 : evt.screenX;

    pos.x = 'left + ' + x_offs ;
    pos.y = extra || w_height - evt.screenY < 200? 'center' : 'top + ' + (evt.screenY - 100);

    return pos;
}

// ------------------------------
// Create OK Dialog
// ------------------------------
var createDialogOk = function (params)
{

    if (vext_dialog) {
        vext_dialog.close();
    }

    vext_dialog = new $.Zebra_Dialog(params.message, {
        'title': params.title,
        'custom_class': params.class,
        'type': false,
        'modal': true,
        'position': ['center', 'middle - 100'],
        'backdrop_opacity': 0.6,
        'buttons':  [
            {
                caption: vext.trans('bread.dialog_button_ok'), callback: function() {}
            }
        ]
    });
}

// ------------------------------
// Create YES / NO Dialog
// ------------------------------
var createDialogYesNo = function (params)
{

    if (vext_dialog) {
        vext_dialog.close();
    }

    vext_dialog = new $.Zebra_Dialog(params.message, {
        'title': params.title,
        'custom_class': params.class,
        'type': false,
        'modal': true,
        'position': ['center', 'middle - 100'],
        'backdrop_opacity': 0.6,
        'buttons':  [
            { caption: params.yes, callback: params.callback },
            {
                caption: vext.trans('bread.dialog_button_cancel'), callback: function() {}
            }
        ]
    });

}

// ------------------------------
// args.route = URL for AJAX request
// args.params = data to send to the server
// args.remove_element = the element to be removed from the DOM tree
// ------------------------------
var dialogMediaRemove = function (args) {

    vext.createDialogYesNo( {
        'title': vext.trans('bread.dialog_remove_title'),
        'message': vext.trans('bread.dialog_remove_message') + '"<span class="dialog-file-name">' + args.params.filename + '</span>"',
        'class': 'vext-dialog-warning',
        'yes': vext.trans('bread.dialog_button_remove'),
        'callback': function () {

            $.post(args.route, args.params, function (response) {

                if ( response && response.data && response.data.status == 200) {

                    toastr.success(response.data.message);

                    // Remove DOM elements holders
                    var count_media_files = 0;
                    var first_element = args.remove_elements[0];
                    var is_media_files = $(first_element).hasClass('adv-media-files-item');

                    args.remove_elements.each(function(index, elem) {
                        $(elem).fadeOut(300, function() {

                            // If we have many items we need to remove also the container of all media items
                            if(is_media_files) {
                                count_media_files = $(this).parent().find('.adv-media-files-item').length;
                                if (count_media_files === 1) {
                                    $(this).parent().parent().remove();
                                }
                            }

                            // Remove Item holder
                            $(this).remove();

                        });
                    });

                    // Remove Bunch holder if present
                    if(is_media_files) {
                        $(first_element).parent().parent().find('.bunch-adv-remove-holder').addClass('hidden');
                    }

                } else {
                    toastr.error(vext.trans('bread.error_removing_media'));
                }
            });
        }
    });
};

// ------------------------------
// Request Certain Action
// ------------------------------
var dialogActionRequest = function (args) {

    vext.createDialogYesNo( {
        'title': vext.trans('bread.dialog_remove_title'),
        'message': '<form action="' + args.url + '" id="action_form" method="' + args.method + '">'+
            args.method_field +
            args.csrf_field +
            args.fields +
            '</form>' + args.message,
        'class': args.class,
        'yes': args.yes,
        'callback': function () {
            $('#action_form').submit();
        }
    });
};

// ------------------------------
// Set image SRC based on File INPUT field
// ------------------------------
var readURL = function (input)
{
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var ext = input.files[0].name.split('.').pop().toLowerCase();
        var image_path = `/${window.rootAdminRoute}/voyager-extension-assets?path=icons/files/${ext}.svg`;

        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'svg') {
            reader.onload = function (e) {
                $('.change-file-holder img').attr('src', e.target.result).data('file-type', 'image');;
            };
        } else {
            $('.change-file-holder img').attr('src', image_path).data('file-type', 'file');
        }

        reader.readAsDataURL(input.files[0]);
    }
}


// ------------------------------
// Load translations from the backend
// ------------------------------
window.translations = {};
$.get(`/${window.rootAdminRoute}/voyager-extension-translations`, null, function (data) {
    if (data) {
        window.translations = data;
    } else {
        toastr.error(vext.trans('bread.error_translation_loading'));
    }
});

$('document').ready(function () {

    window.vext_page_content = $(".page-content");
    window.csrf_token = $('meta[name="csrf-token"]').attr('content');
    window.vext_dialog = null;
    window.vext_change_file_form = null;
    window.vext_page_content = $(".page-content");

    // Bread field helper binding
    vext_page_content.on("click", ".control-label", function () {
        var helper = $(this).parent().find('.field-helper');
        if (!helper.hasClass('showed')) {
            helper.addClass('showed');
        } else {
            helper.removeClass('showed');
        }
    });

});

exports.trans = trans;
exports.getMediaParams = getMediaParams;
exports.getDialogPosition = getDialogPosition;
exports.readURL = readURL;
exports.createDialogOk = createDialogOk;
exports.createDialogYesNo = createDialogYesNo;
exports.dialogMediaRemove = dialogMediaRemove;
exports.dialogActionRequest = dialogActionRequest;
