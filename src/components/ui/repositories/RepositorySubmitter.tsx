import {MultiSelect} from '@digichanges/solid-multiselect';
import {createSignal} from "solid-js";

export default function ({tags}: { tags: string[] }) {
    const [selectedTags, setSelectedTags] = createSignal<string[]>([]);

    return <div class = "flex flex-col gap-2">
        {selectedTags().map(tag => <input type = "hidden" name = "tags" value = {tag}/>)}<p class = "font-semibold">Select Tags</p>
        <MultiSelect style = {{chips: {color: "black", "background-color": "sky"}, option: {color: "black"}, notFound: {color: "black"}}}
            options = {tags}
            onSelect = {setSelectedTags}
            onRemove = {setSelectedTags}
            placeholder = ""
            emptyRecordMsg = "No more tags"
            showArrow = {false}
        />

        {selectedTags().length > 0 && <button type = "submit" class = "flex-grow w-full bg-green-700 hover:bg-green-600 text-white p-2 text-center">Submit Repository</button>}

        {selectedTags().length === 0 && <div class = "flex-grow w-full bg-rose-700 text-white p-2 text-center">
            No tags selected
        </div>}
    </div>
}
