
angular.module('socialApp')

    .directive('imageBrowser', function(UploadService) {
        return {
            restrict        :'A',
            replace         : true,
            scope           : {
                value       : '='
            },
            link            : function(scope, element){

                let inputElement = document.createElement('input');
                let imageElement = document.createElement('img');
                let previewOn = false;
                if(scope.value){
                    imageElement.src = scope.value;
                    element.after(imageElement);
                    previewOn = true;
                }


                function readFileAsync(file) {
                    return new Promise((resolve, reject) => {
                        let reader = new FileReader();
                        reader.onload = () => {
                            resolve(reader.result);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    })
                }


                function handleFiles() {
                    let file = this.files[0];
                    vff.state.upload(file, (e)=>{
                        console.log("upload file", e);
                        readFileAsync(file).then(base64 => {
                            imageElement.src = base64;
                            if(!previewOn){
                                element.after(imageElement);
                            }
                        });
                        UploadService.uploadFile(file, e.urls.uploadUrl, {
                            onSuccess : ()=> {
                                scope.value = e.urls.cdnUrl;
                                // imageElement.src = e.urls.cdnUrl;
                                scope.$apply();
                            }
                        })
                    },)
                }

                inputElement.setAttribute('type', 'file');
                inputElement.style.display = 'none';

                element.on('click', () => {
                    inputElement.click();
                });
                inputElement.addEventListener("change", handleFiles, false);

            }
        };
    })
;