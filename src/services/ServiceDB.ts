// fetch("https://api.dropboxapi.com/2/files/list_folder", {
//   method: "post",
//   headers: {
//     Authorization:
//       "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
//     "Content-Type": "application/json"
//   },
//   body:
//     '{"path": "/programming/art","recursive": false,"include_media_info": false,"include_deleted": false,"include_has_explicit_shared_members": false,"include_mounted_folders": true,"include_non_downloadable_files": true}'
// }).then(async response => {
//   console.log(await response.json());
// });

// fetch("https://content.dropboxapi.com/2/files/get_thumbnail", {
//   method: "post",
//   headers: {
//     Authorization:
//       "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
//     "Dropbox-API-Arg":
//       '{"path": "/programming/art/ioulia_27_by_johngoodstudio-dcpetzs.jpg","format": "jpeg","size": "w64h64","mode": "strict"}'
//   }
// }).then(async response => {
//   var b = await response.blob();
//   var objectURL = URL.createObjectURL(b);

//   document.querySelector("#foo").src = objectURL;
//   //URL.revokeObjectURL(objectURL);
// });

// fetch("https://api.dropboxapi.com/2/files/get_temporary_link", {
//   method: "post",
//   headers: {
//     Authorization:
//       "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
//     "Content-Type": "application/json"
//   },
//   body: '{"path": "/programming/art/so_cute_2_by_charmeurindien-dc2xin2.jpg"}'
// }).then(async response => {
//   var b = await response.json();

//   document.querySelector("#foo").src = b.link;
//   //URL.revokeObjectURL(objectURL);
// });

const APP = "dnd_app_data";
const IMAGES = "images";
const ACTOR_REPOSITORY = "actorRepository.json";
const INSTANCE_REPOSITORY = "instanceRepository.json";
const IMAGE_REPOSITORY = "imageRepository.json";

type file = "actor" | "image" | "instance";
let instance = null;
class ServiceDB {
    constructor() {}
    static async init() {
        if (!instance) {
            await checkDnDAppNS();
            await checkDnDAppDir();
            instance = new ServiceDB();
        }
        return instance;
    }
    async read(file: file): Promise<string> {
        let path = "";
        switch (file) {
            case "image":
                path = `/${APP}/${IMAGE_REPOSITORY}`;
                break;
            case "actor":
                path = `/${APP}/${ACTOR_REPOSITORY}`;
                break;
            case "instance":
                path = `/${APP}/${INSTANCE_REPOSITORY}`;
                break;
        }
        var res = await fetch(
            "https://content.dropboxapi.com/2/files/download",
            {
                method: "post",
                headers: {
                    Authorization:
                        "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
                    "Dropbox-API-Arg": `{"path": "${path}"}`
                }
            }
        );
        return await res.text();
    }
    async save(file: file, data: string): Promise<void> {
        let path = "";
        switch (file) {
            case "image":
                path = `/${APP}/${IMAGE_REPOSITORY}`;
                break;
            case "actor":
                path = `/${APP}/${ACTOR_REPOSITORY}`;
                break;
            case "instance":
                path = `/${APP}/${INSTANCE_REPOSITORY}`;
                break;
        }
        return new Promise(res => {
            var reader = new FileReader();
            reader.onload = async function() {
                await fetch("https://content.dropboxapi.com/2/files/upload", {
                    method: "post",
                    headers: {
                        Authorization:
                            "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
                        "Dropbox-API-Arg": `{"path": "${path}","mode": "overwrite","autorename": true,"mute": false,"strict_conflict": false}`,
                        "Content-Type": "application/octet-stream"
                    },
                    body: reader.result
                });
                res();
            };
            reader.readAsArrayBuffer(new Blob([data]));
        });
    }
}

async function checkDnDAppNS() {
    var res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
        method: "post",
        headers: {
            Authorization:
                "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
            "Content-Type": "application/json"
        },
        body:
            '{"path": "","recursive": false,"include_media_info": false,"include_deleted": false,"include_has_explicit_shared_members": false,"include_mounted_folders": true,"include_non_downloadable_files": true}'
    });
    var resjson = await res.json();
    if (
        resjson.entries.some(v => v[".tag"] === "folder" && v.name === APP) ===
        false
    ) {
        res = await fetch(
            "https://api.dropboxapi.com/2/files/create_folder_v2",
            {
                method: "post",
                headers: {
                    Authorization:
                        "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
                    "Content-Type": "application/json"
                },
                body: `{"path": "/${APP}","autorename": false}`
            }
        );
    }
}
async function checkDnDAppDir() {
    var res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
        method: "post",
        headers: {
            Authorization:
                "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
            "Content-Type": "application/json"
        },
        body: `{"path": "/${APP}","recursive": false,"include_media_info": false,"include_deleted": false,"include_has_explicit_shared_members": false,"include_mounted_folders": true,"include_non_downloadable_files": true}`
    });
    var resjson = await res.json();
    await checkImageDir(resjson);
    await checkUserRepository(resjson);
    await checkInstanceRepository(resjson);
    await checkImageRepository(resjson);
}
async function checkImageDir(resjson) {
    if (
        resjson.entries.some(
            v => v[".tag"] === "folder" && v.name === IMAGES
        ) === false
    ) {
        await fetch("https://api.dropboxapi.com/2/files/create_folder_v2", {
            method: "post",
            headers: {
                Authorization:
                    "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
                "Content-Type": "application/json"
            },
            body: `{"path": "/${APP}/${IMAGES}","autorename": false}`
        });
    }
}
async function checkUserRepository(resjson) {
    if (resjson.entries.some(v => v.name === ACTOR_REPOSITORY) === false) {
        return new Promise(res => {
            var reader = new FileReader();
            reader.onload = async function() {
                await fetch("https://content.dropboxapi.com/2/files/upload", {
                    method: "post",
                    headers: {
                        Authorization:
                            "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
                        "Dropbox-API-Arg": `{"path": "/${APP}/${ACTOR_REPOSITORY}","mode": "overwrite","autorename": true,"mute": false,"strict_conflict": false}`,
                        "Content-Type": "application/octet-stream"
                    },
                    body: reader.result
                });
                res();
            };
            reader.readAsArrayBuffer(new Blob([`[]`]));
        });
    }
}
async function checkInstanceRepository(resjson) {
    if (resjson.entries.some(v => v.name === INSTANCE_REPOSITORY) === false) {
        return new Promise(res => {
            var reader = new FileReader();
            reader.onload = async function() {
                await fetch("https://content.dropboxapi.com/2/files/upload", {
                    method: "post",
                    headers: {
                        Authorization:
                            "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
                        "Dropbox-API-Arg": `{"path": "/${APP}/${INSTANCE_REPOSITORY}","mode": "overwrite","autorename": true,"mute": false,"strict_conflict": false}`,
                        "Content-Type": "application/octet-stream"
                    },
                    body: reader.result
                });
                res();
            };
            reader.readAsArrayBuffer(new Blob([`[]`]));
        });
    }
}
async function checkImageRepository(resjson) {
    if (resjson.entries.some(v => v.name === IMAGE_REPOSITORY) === false) {
        return new Promise(res => {
            var reader = new FileReader();
            reader.onload = async function() {
                await fetch("https://content.dropboxapi.com/2/files/upload", {
                    method: "post",
                    headers: {
                        Authorization:
                            "Bearer lt-wyxv0LCEAAAAAAAAJCPPTV-l2md4oFIA8gVCAeyOO9WkMH0qyTATQDGJNfE6y",
                        "Dropbox-API-Arg": `{"path": "/${APP}/${IMAGE_REPOSITORY}","mode": "overwrite","autorename": true,"mute": false,"strict_conflict": false}`,
                        "Content-Type": "application/octet-stream"
                    },
                    body: reader.result
                });
                res();
            };
            reader.readAsArrayBuffer(new Blob([`[]`]));
        });
    }
}

export default ServiceDB;
