import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BluetoothDeviceSelectorComponent } from './bluetooth-device-selector.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BluetoothDeviceSelectorComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BluetoothDeviceSelectorRoutingModule { }
