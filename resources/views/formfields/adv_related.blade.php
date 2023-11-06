@if ($related_options = isset($row->details->related_model)? $row->details->related_model : null)
<div class="adv-related-wrapper">
    <div id="adv-related-list-{{$row->field}}" data-field="{{$row->field}}" class="adv-related-list">
    @if (!empty($dataTypeContent->{$row->field}))
        @foreach(json_decode($dataTypeContent->{$row->field}) as $item)
        <div class="adv-related-item" data-data="{{ json_encode($item) }}">
            <div class="adv-related-item__handle"><span></span><span></span><span></span></div>
            <div class="adv-related-item__title">{{ $item->fields->{$item->display_field} }}</div>
            <div class="adv-related-item__remove">
                <button data-field="{{ $row->field }}" type="button" class="btn btn-danger remove-related"><i class='voyager-x'></i></button>
            </div>
        </div>
        @endforeach
    @endif
    </div>
    <div class="adv-related-add-holder">
        <div class="adv-related-add-form">
            <div class="adv-related-add-autocomplete">
                <input class="related-autocomplete"
                       id="adv-related-autocomplete-{{$row->field}}"
                       name="adv-related-autocomplete-{{$row->field}}"
                       type="text"
                       data-field="{{$row->field}}"
                       data-url="{{ route('voyager.ext-records-get') }}"
                       data-slug="{{ $related_options->source }}"
                       data-search-field="{{ $related_options->search_field }}"
                       data-display-field="{{ $related_options->display_field }}"
                       data-fields="{{ implode(',', $related_options->fields) }}"
                        >
                <button data-field="{{$row->field}}" type="button" disabled class="btn btn-success add-related"><i class='voyager-list-add'></i></button>
            </div>
        </div>
    </div>
    <input id="{{$row->field}}" name="{{$row->field}}" type="hidden" value="{{ $dataTypeContent->{$row->field} }}">
</div>
@else
<div class="adv-related-no-options">{{ __('voyager-extension::bread.no_related_json_data') }}: {{ $row->field }}</div>
@endif
