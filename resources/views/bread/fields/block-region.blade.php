@if(!isset($edit) && isset($data->positionId->color))
    @if ($row->type == 'relationship' || !empty($data->{$row->field}))
        <span class="badge badge-md region-block-badge" style="background-color: {{ $data->positionId->color }};">
            @if ($row->type == 'relationship')
                @include('voyager::formfields.relationship', ['view' => 'browse','options' => $row->details])
            @else
                {{ $data->{$row->field} }}
            @endif
        </span>
    @endif
@endif
