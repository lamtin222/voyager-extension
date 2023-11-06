@push('javascript')
    <script>

        function tinymce_setup_callback(editor)
        {
            // Initializing options doesn't work anymore with version TinyMCE 6.?+
        }

        var ace_editor_element = document.getElementsByClassName("ace_editor");

        // For each ace editor element on the page
        for(var i = 0; i < ace_editor_element.length; i++)
        {
            // Create an ace editor instance
            var ace_editor = ace.edit(ace_editor_element[i].id);

            // Set auto height of window
            ace_editor.setOptions({
                maxLines: Infinity
            });
        }

        //Fix to avoid "Uncaught TypeError: ace.require is not a function" error
        window.ace.require = window.ace.acequire;

        $('document').ready(function () {

            // Remove Legacy Voyager DIALOG BOX, We'll use our own dialog box implementation.
            $('#confirm_delete_modal').remove();

            // Generate Routes for Frontend JS
            window.vext_page_slug = "{{$page_slug}}";
            window.vext_routes = {
                'voyager_media_remove': '{{ route("voyager." . $page_slug . ".media.remove") }}',
                'ext_media_remove': '{{ route("voyager." . $page_slug . ".ext-media.remove") }}',
                'ext_media_sort': '{{ route("voyager." . $page_slug . ".ext-media.sort") }}',
                'ext_media_update': '{{ route("voyager." . $page_slug . ".ext-media.update") }}',
                'ext_media_change': '{{ route("voyager." . $page_slug . ".ext-media.change") }}',
                'ext_media_form': '{{ route("voyager." . $page_slug . ".ext-media.form") }}',
            };

        });
    </script>
@endpush
