import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBoxComponent } from './search-box.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { setupModuleTranslations } from '../../utils/translate_helpers';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TRANSLATIONS } from './i18n/pl.js';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SearchBoxComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    SearchBoxComponent
  ]
})
export class SearchBoxModule {
  constructor(private translate: TranslateService) {
    setupModuleTranslations(
      this.translate,
      'search_box',
      [
        ['pl', TRANSLATIONS]
      ]);
  }
}
