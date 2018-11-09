import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  files: TreeNode[];
  isActive = false;
  unSupportedMsg: string;

  private folderData = [];
  private filesData = [];
  constructor() { }

  onFilesLoaded(e) {
    this.folderData = this.folderData.concat(e.folderData);
    this.filesData = this.filesData.concat(e.filesData);
    this.files =  <TreeNode[]>this.folderData.map(element => this.convertTree(element));
  }

  private convertTree(node) {
    return node.isDirectory ? {
      label: node.name,
      data: node.fullPath,
      expandedIcon: 'fa fa-folder-open',
      collapsedIcon: 'fa fa-folder',
      children: node.children.map(element => this.convertTree(element))
    } : {
        label: node.name,
        data: node.fullPath,
        icon: 'fa fa-file-word-o',
      };
  }

  onErr(e) {
    this.unSupportedMsg = e;
  }

  onActive() {
    if (!this.unSupportedMsg) {
      this.isActive = true;
    }
  }

  onInactive() {
    this.isActive = false;
  }
}
