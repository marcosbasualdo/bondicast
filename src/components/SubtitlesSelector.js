import React from "react";
import VTTConverter from 'srt-webvtt'

function SubtitlesSelector({onSelect}){

    const onChange = async (event) => {

        let file = event.target.files[0];

        if(isSrt(file.name)){
            const vttConverter = new VTTConverter(file)
            onSelect(await vttConverter.getURL())
        }else if (isVTT(file.name)){
            let reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = (evt) => {
                let content = evt.target.result;
                let blob = new Blob([content], {type: 'text/vtt'});
                let file = URL.createObjectURL(blob);
                onSelect(file);
            }
        }

    }

    const isSrt = (filename) =>
    {
        return filename.split('.').pop().toLowerCase() === 'srt' ? true : false;
    }

    const isVTT = (filename) =>
    {
        return filename.split('.').pop().toLowerCase() === 'vtt' ? true : false;
    }

    return (
        <input onChange={onChange} type="file" />
    )
}

export default SubtitlesSelector;