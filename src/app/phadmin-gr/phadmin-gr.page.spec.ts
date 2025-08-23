import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhadminGRPage } from './phadmin-gr.page';

describe('PhadminGRPage', () => {
  let component: PhadminGRPage;
  let fixture: ComponentFixture<PhadminGRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhadminGRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
