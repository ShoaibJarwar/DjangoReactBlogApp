export default class CustomUploadAdapter {
  constructor(loader, token) {
    this.loader = loader;
    this.token = token;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", file);

          fetch("http://127.0.0.1:8000/api/uploads/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              // backend must return { url: "http://..." }
              resolve({ default: data.url });
            })
            .catch((err) => reject(err));
        })
    );
  }

  abort() {}
}

export function CustomUploadPlugin(editor, token) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader, token);
  };
}

