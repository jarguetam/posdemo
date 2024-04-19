import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { DataDashBoard } from './models/data-dashboard';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { Messages } from 'src/app/helpers/messages';
import { DashobarDataModel } from './models/dashboar-data-model';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    items: MenuItem[];
    options: any;
    chartData: any;
    chartOptions: any;
    subscription: Subscription;
    config: AppConfig;
    dataDashboard: DashobarDataModel[] = [];
    loading: boolean = false;
    chartData2: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            fill: boolean;
            backgroundColor: string;
            borderColor: string;
            tension: number;
        }[];
    };
    chartData3: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            fill: boolean;
            backgroundColor: string;
            borderColor: string;
            tension: number;
        }[];
    };
    charLastSaleDay: {
        labels: any;
        datasets: {
            label: string;
            data: any;
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    charOrderSeller: {
        labels: any;
        datasets: [
            {
                label: string
                data: any;
                backgroundColor: string[];
                hoverBackgroundColor: string[];
            }
        ];
    };
    charStockWarehouse: {
        labels: any;
        datasets: {
            label: string;
            data: any;
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    charStockCategory: {
        labels: any;
        datasets: {
            label: string;
            data: any;
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    charInvoiceMonth: {
        labels: any;
        datasets: {
            label: string;
            data: any;
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    charMargenMonth: {
        labels: any;
        datasets: {
            label: string;
            data: any;
            backgroundColor: string[];
            hoverBackgroundColor: string[];
            fill: false;
            tension: 0.4;
        }[];
    };
    charSaleSeller: {
        labels: any;
        datasets: {
            label: string;
            data: any;
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    user: User;
    ver_cliente: boolean = false;
    ver_provedor: boolean = false;
    ver_articulos: boolean = false;
    ver_almacen: boolean = false;
    ver_rentabilidad: boolean = false;
    ver_ventas_7_dias: boolean = false;
    ver_facturacion_mes: boolean = false;
    ver_pedidos_vendedor: boolean = false;
    ver_inventario_almacen: boolean = false;
    ver_ventas_vendedor: boolean = false;
    ver_inventario_categoria: boolean = false;
    charInvoicePurchaseMonth: {
        labels: String[];
        datasets: {
            label: string;
            data: String[];
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    charLastPurchaseDay: {
        labels: String[];
        datasets: {
            label: string;
            data: String[];
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    charTop5iItemPurchase: {
        labels: String[];
        datasets: {
            label: string;
            data: String[];
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    ver_cxp: boolean = false;
    ver_cxc: boolean = false;
    ver_top_item_sale: boolean = false;
    ver_top_item_purchase: boolean = false;
    charTop5iItemSale: {
        labels: String[];
        datasets: {
            label: string;
            data: String[];
            backgroundColor: string[];
            hoverBackgroundColor: string[];
        }[];
    };
    horizontalOptions: {
        indexAxis: string;
        plugins: { legend: { labels: { color: string } } };
        scales: {
            x: { ticks: { color: string }; grid: { color: string } };
            y: { ticks: { color: string }; grid: { color: string } };
        };
    };
    ver_compras_7_dias: boolean = false;
    ver_compras_mes: boolean = false;

    constructor(
        public configService: ConfigService,
        public dashboardService: DashboardService,
        private auth: AuthService
    ) {
        this.user = this.auth.UserValue;
    }

    ngOnInit() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');
        this._getData();
        this.getPermision();
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
                this.updateChartOptions();
            }
        );
        this.horizontalOptions = {
            indexAxis: 'y',
            plugins: {
                legend: {
                    labels: {
                        color: '#495057',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
                y: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
            },
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    updateChartOptions() {
        if (this.config.dark) this.applyDarkTheme();
        else this.applyLightTheme();
    }

    applyDarkTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef',
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    },
                },
                y: {
                    ticks: {
                        color: '#ebedef',
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    },
                },
            },
        };
    }

    applyLightTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
                y: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
            },
        };
    }

    async _getData() {
        try {
            this.loading = true;
           // Messages.loading('Cargando datos', 'Espere un momento....');
            var backgroundColor = [
                '#42A5F5',
                '#66BB6A',
                '#FFA726',
                '#495057',
                '#9966FF',
            ];
            var hoverBackgroundColor = [
                '#64B5F6',
                '#81C784',
                '#FFB74D',
                '#9966FF',
            ];
            this.dataDashboard = await this.dashboardService.getData(
                this.user.userId
            );
            Messages.closeLoading();
            this.charLastSaleDay = {
                labels: this.dataDashboard[4].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Venta L.',
                        data: this.dataDashboard[4].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };
            this.charOrderSeller = {
                labels: this.dataDashboard[5].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Pedidos',
                        data: this.dataDashboard[5].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };

            this.charStockWarehouse = {
                labels: this.dataDashboard[6].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Inventario',
                        data: this.dataDashboard[6].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };
            this.charStockCategory = {
                labels: this.dataDashboard[7].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Inventario',
                        data: this.dataDashboard[7].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };
            this.charInvoiceMonth = {
                labels: this.dataDashboard[8].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Venta L.',
                        data: this.dataDashboard[8].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };
            this.charMargenMonth = {
                labels: this.dataDashboard[9].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Margen %',
                        data: this.dataDashboard[9].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                        fill: false,
                        tension: 0.4,
                    },
                ],
            };
            this.charSaleSeller = {
                labels: this.dataDashboard[16].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Venta L.',
                        data: this.dataDashboard[16].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };
            this.charTop5iItemSale = {
                labels: this.dataDashboard[11].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Ventas L.',
                        data: this.dataDashboard[11].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };
            //Purchase
            this.charInvoicePurchaseMonth = {
                labels: this.dataDashboard[15].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Compras L.',
                        data: this.dataDashboard[15].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };
            this.charTop5iItemPurchase = {
                labels: this.dataDashboard[13].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Compras L.',
                        data: this.dataDashboard[13].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };
            this.charLastPurchaseDay = {
                labels: this.dataDashboard[14].data.map(
                    (item) => item.description
                ),
                datasets: [
                    {
                        label: 'Compras L.',
                        data: this.dataDashboard[14].data.map(
                            (item) => item.qty
                        ),
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: hoverBackgroundColor,
                    },
                ],
            };

            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    getPermision() {
        this.ver_cliente = this.auth.hasPermission('ver_cliente');
        this.ver_provedor = this.auth.hasPermission('ver_provedor');
        this.ver_articulos = this.auth.hasPermission('ver_articulos');
        this.ver_almacen = this.auth.hasPermission('ver_almacen');
        this.ver_rentabilidad = this.auth.hasPermission('ver_rentabilidad');
        this.ver_ventas_7_dias = this.auth.hasPermission('ver_ventas_7_dias');
        this.ver_facturacion_mes = this.auth.hasPermission(
            'ver_facturacion_mes'
        );
        this.ver_pedidos_vendedor = this.auth.hasPermission(
            'ver_pedidos_vendedor'
        );
        this.ver_inventario_almacen = this.auth.hasPermission(
            'ver_inventario_almacen'
        );
        this.ver_ventas_vendedor = this.auth.hasPermission(
            'ver_ventas_vendedor'
        );
        this.ver_inventario_categoria = this.auth.hasPermission(
            'ver_inventario_categoria'
        );
        this.ver_cxp = this.auth.hasPermission('ver_cxp');
        this.ver_cxc = this.auth.hasPermission('ver_cxc');
        this.ver_top_item_sale = this.auth.hasPermission('ver_top_item_sale');
        this.ver_top_item_purchase = this.auth.hasPermission(
            'ver_top_item_purchase'
        );
        this.ver_compras_7_dias = this.auth.hasPermission('ver_compras_7_dias');
        this.ver_compras_mes = this.auth.hasPermission('ver_compras_mes');
    }
}
