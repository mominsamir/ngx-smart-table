import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSmartTableModule } from 'projects/ngx-smart-table/src/public-api';

import { SharedModule } from '../../shared/shared.module';
import { routes } from './examples.routes';
import { ExamplesComponent } from './examples.component';
import { AdvancedExampleFiltersComponent } from './filter/advanced-example-filters.component';
import { AdvancedExampleConfirmComponent } from './various/advanced-example-confirm.component';
import { AdvancedExamplesCustomEditorComponent } from './custom-edit-view/advanced-example-custom-editor.component';
import { AdvancedExamplesTypesComponent } from './custom-edit-view/advanced-example-types.component';
import { AdvancedExampleServerComponent } from './server/advanced-example-server.component';
import { BasicExampleLoadComponent } from './server/basic-example-load.component';
import { BasicExampleMultiSelectComponent } from './various/basic-example-multi-select.component';
import { SingleSelectComponent } from './various/single-select.component';
import { CustomEditorComponent } from './custom-edit-view/custom-editor.component';
import { BasicExampleSourceComponent } from './filter/basic-example-source.component';
import { CustomRenderComponent } from './custom-edit-view/custom-render.component';
import { CustomFilterComponent } from './custom-edit-view/custom-filter.component';
import { DivViewComponent, RowExpandComponent } from './custom-edit-view/row-expand-example';
import { FilterExamplesComponent } from './filter/filter-examples.component';
import { ServerExamplesComponent } from './server/server-examples.component';
import { CustomViewEditExamplesComponent } from './custom-edit-view/custom-edit-view-examples.component';
import { BasicExampleCustomActionsComponent } from './custom-edit-view/basic-example-custom-actions.component';
import { VariousExamplesComponent } from './various/various-examples.component';


import {
  BasicExampleButtonViewComponent,
  ButtonViewComponent,
} from './custom-edit-view/basic-example-button-view.component';
import { EmptyDataComponent } from './custom-edit-view/empty-data-example';

const EXAMPLES_COMPONENTS = [
  AdvancedExampleFiltersComponent,
  AdvancedExampleConfirmComponent,
  AdvancedExamplesCustomEditorComponent,
  AdvancedExamplesTypesComponent,
  AdvancedExampleServerComponent,
  BasicExampleLoadComponent,
  BasicExampleMultiSelectComponent,
  BasicExampleSourceComponent,
  CustomEditorComponent,
  CustomRenderComponent,
  CustomFilterComponent,
  FilterExamplesComponent,
  ServerExamplesComponent,
  CustomViewEditExamplesComponent,
  VariousExamplesComponent,
  BasicExampleButtonViewComponent,
  BasicExampleCustomActionsComponent,
  ButtonViewComponent,
  RowExpandComponent,
  EmptyDataComponent,
  SingleSelectComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxSmartTableModule,
    SharedModule,
  ],
  entryComponents: [
    CustomEditorComponent,
    CustomRenderComponent,
    CustomFilterComponent,
    ButtonViewComponent,
    DivViewComponent,
    RowExpandComponent,
    EmptyDataComponent,
  ],
  declarations: [
    ExamplesComponent,
    ...EXAMPLES_COMPONENTS,
  ],
})
export class ExamplesModule { }
