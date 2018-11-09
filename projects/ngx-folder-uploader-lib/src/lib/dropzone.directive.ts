import { Directive, ElementRef, HostListener, Output, EventEmitter, NgZone } from '@angular/core';
import { Observable, forkJoin, of, Subscriber } from 'rxjs';

@Directive({
  selector: '[fuDropzone]'
})
export class DropzoneDirective {
  folderData = [];
  filesData = [];
  @Output()
  public dropZoneActive = new EventEmitter<any>();
  @Output()
  public dropZoneInactive = new EventEmitter<any>();
  @Output()
  public loading = new EventEmitter<any>();
  @Output()
  public filesLoaded = new EventEmitter<any>();
  @Output()
  public error = new EventEmitter<any>();

  constructor(private el: ElementRef, private _ngZone: NgZone) { }

  @HostListener('dragover', ['$event']) onDragover(event) {
    this.dropZoneActive.emit();
    event.preventDefault();
  }

  @HostListener('dragleave') onDragleave() {
    this.dropZoneInactive.emit();
  }

  @HostListener('drop', ['$event']) onDrop(event) {
    event.preventDefault();
    this.loading.emit();
    this.folderData = [];
    this.filesData = [];
    this._ngZone.runOutsideAngular(() => {
      try {
        const items = event.dataTransfer.items;
        const obs = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i].webkitGetAsEntry();
          if (item) {
            obs.push(new Observable<any>(observer => this.scanFiles(item, this.folderData, observer)));
          }
        }
        forkJoin(obs).subscribe(e =>
          this._ngZone.run(() =>
            this.filesLoaded.emit({ folderData: this.folderData, filesData: this.filesData })
          )
        );
      } catch (error) {
        console.error(error);
        this._ngZone.run(() => this.error.emit('Folder upload is unsupported by this browser'));
      }
    });

    this.dropZoneInactive.emit();
  }

  private scanFiles(item, container: Array<any>, observer: Subscriber<any>) {
    const nodeData = {
      name: item.name,
      isDirectory: item.isDirectory,
      fullPath: item.fullPath,
      item: item,
      children: []
    };

    container.push(nodeData);
    if (item.isDirectory) {
      const directoryReader = item.createReader();
      directoryReader.readEntries(entries => {
        if (entries) {
          if (entries.length === 0) {
            observer.next();
            observer.complete();
          } else {
            const subObs = entries.map(entry => new Observable<any>(innerObserver =>
              this.scanFiles(entry, nodeData.children, innerObserver)));
            forkJoin(subObs).subscribe(e => {
              observer.next();
              observer.complete();
            });
          }
        } else {
          observer.next();
          observer.complete();
        }
      });
    } else if (item.isFile) {
      item.file(file => {
        file.fullPath = item.fullPath;
        this.filesData.push(file);
        observer.next();
        observer.complete();
      });
    }
  }
}
