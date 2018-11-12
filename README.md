# Angular Folder Uploader

<a href="https://badge.fury.io/js/ngx-folder-uploader-lib"><img src="https://badge.fury.io/js/ngx-folder-uploader-lib.svg" align="right" alt="npm version" height="18"></a>

This is an Angular library for folder upload. This library only provides the core behavior of folder upload. Drag folders or files into the dropzone area. By event, it will send you the data to display or to upload. For appearance, you can define whatever you want. And because most frontend projects have their own services to send data to backend, this lib doesn't encapsulate POST method. Instead, it pass out the file data for you to post in your way.

![image](https://github.com/ft115637850/ngx-folder-uploader/blob/master/preview.gif)

## Browser versions tested

* Google Chrome 70
* Mozilla Firefox 63
* Apple Safari 11.1.0

## Installing an usage
`npm i ngx-folder-uploader-lib --save`

##### Load the module for your app
```javascript
import { NgxFolderUploaderLibModule } from 'ngx-folder-uploader-lib';

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...,
    NgxFolderUploaderLibModule
  ],
  providers: [],
})

```

##### Use it in your HTML template
```html
<div id="dropzone" fuDropzone (filesLoaded)="onFilesLoaded($event)" (dropZoneActive)="onActive()" (dropZoneInactive)="onInactive()" (error)="onErr($event)" />
```

```javascript
fuDropzone              // Used to declare dropzone area.
(filesLoaded)           // Event handler for dropzone load complete event. 
                        // It sends out
                        // folderData -- this is used for display folder structure.
                        // filesData  --  this is used for POST files to backend.
(dropZoneActive)        // Event handler for the dropzone active event.
(dropZoneInactive)      // Event handler for the dropzone inactive event.
(error)                 // Event handler for the dropzone error event.
```

For more detail, check `src/app` as example.

## Build

Run `ng build ngx-folder-uploader-lib` to build the library project. The build artifacts will be stored in the `dist/ngx-folder-uploader-lib/` directory. Use the `--prod` flag for a production build.
