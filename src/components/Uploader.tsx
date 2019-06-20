import * as React from "react";
import { File } from "../services/ServiceImage";

interface UploaderProps {
    multiple?: boolean;
    onSelected: (f: File) => void;
}

const Uploader = props => {
    const multiple = props.multiple || false;

    const onFileSelected = async e => {
        await [...e.target.files].mapAsync(async file => {
            var reader = new FileReader();
            return await new Promise(res => {
                reader.onload = function() {
                    console.log(file.name, reader.result);
                    props.onSelected({
                        name: file.name,
                        data: reader.result
                    });
                    res();
                };
                reader.readAsArrayBuffer(file);
            });
        });

        //@ts-ignore
        document.querySelector("#file-selector").value = "";
    };
    // const save = (name, data) => {
    //     return fetch(" https://content.dropboxapi.com/2/files/upload", {
    //         method: "post",
    //         headers: {
    //             Authorization:
    //                 "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
    //             "Dropbox-API-Arg": `{"path": "/Homework/math/${name}","mode": "overwrite","autorename": true,"mute": false,"strict_conflict": false}`,
    //             "Content-Type": "application/octet-stream"
    //         },
    //         body: data
    //     }).then(async response => {
    //         var b = await response.json();
    //         console.log(b);
    //     });
    // };
    return (
        <input
            onChange={onFileSelected}
            accept="image/*"
            id="file-selector"
            multiple={multiple}
            type="file"
        />
    );
};

export default Uploader;
