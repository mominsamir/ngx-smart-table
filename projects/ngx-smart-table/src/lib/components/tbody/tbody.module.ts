import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CellModule } from '../cell/cell.module';

import { Ng2SmartTableTbodyComponent } from './tbody.component';
import { TbodyCreateCancelComponent } from './cells/create-cancel.component';
import { TbodyEditDeleteComponent } from './cells/edit-delete.component';
import { TbodyCustomComponent } from './cells/custom.component';
import { TbodyExpandRowComponent } from './cells/expand.component';
import {TreeCellModule} from '../tree-cell/cell.module';

const TBODY_COMPONENTS = [
  TbodyCreateCancelComponent,
  TbodyEditDeleteComponent,
  TbodyCustomComponent,
  TbodyExpandRowComponent,
  Ng2SmartTableTbodyComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CellModule,
    TreeCellModule
  ],
  declarations: [
    ...TBODY_COMPONENTS,
  ],
  exports: [
    ...TBODY_COMPONENTS,
  ],
})
export class TBodyModule { }
