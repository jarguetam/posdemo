import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GroupedCustomer } from '../model/grouped-customer';
import { DocumentSaleModel } from '../../models/document-model';
import { CommonService } from 'src/app/service/common.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { FileSharer } from '@byteowls/capacitor-filesharer';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PrintBalancePdfService {

  constructor(private commonService: CommonService) { }

  async printPDF(groupedCustomer: GroupedCustomer, details: DocumentSaleModel[]) {
    try {
        const documentDefinition = await this.getDocumentDefinition(groupedCustomer, details);

        if (Capacitor.isNativePlatform()) {
          const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

          pdfDocGenerator.getBase64(async (base64) => {
            try {
              const fileName = `Estado_de_cuenta_${groupedCustomer.customerCode}.pdf`;

              await FileSharer.share({
                filename: fileName,
                base64Data: base64,
                contentType: 'application/pdf'
              });

            } catch (error) {
              console.error('Error al compartir PDF:', error);
              alert('Error al compartir el PDF. Por favor intente nuevamente.');
            }
          });
        } else {
          pdfMake.createPdf(documentDefinition).download(`Estado_de_cuenta_${groupedCustomer.customerCode}.pdf`);
        }
      } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF. Por favor intente nuevamente.');
      }
  }

  // Función para verificar permisos
  private async checkPermissions(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        // Aquí puedes implementar la verificación de permisos específica
        // usando los plugins de Capacitor que necesites
        return true;
      } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
      }
    }
    return true;
  }

  private async getDocumentDefinition(groupedCustomer: GroupedCustomer, details: DocumentSaleModel[]): Promise<any> {
    const companyInfo = await this.commonService.companyInfo();
    const logo = await this.getBase64Logo();

    return {
        pageSize: 'LETTER',
        pageMargins: [40, 60, 40, 60],
        header: (currentPage) => {
          if (currentPage === 1) {
            return this.getHeader(companyInfo, logo);
          }
          return null;
        },
        content: [
          { text: 'Estado de Cuenta', style: 'title' },
          this.getCustomerInfo(groupedCustomer),
          this.getDetailsTable(details)
        ],
        footer: this.getFooter(),
        styles: this.getStyles()
      };
  }

  private getHeader(companyInfo: any, logo: string): any {
    return {
      columns: [
        {
         image: logo,
          width: 60,
          height: 60
        },
        {
          text: [
            { text: companyInfo.companyName + '\n', style: 'companyName' },
            { text: companyInfo.addressLine1 + '\n', style: 'companyInfo' },
            { text: 'Tel: ' + companyInfo.phone1, style: 'companyInfo' }
          ],
          alignment: 'right'
        }
      ],
      margin: [40, 20, 40, 40]
    };
  }

  private getCustomerInfo(groupedCustomer: GroupedCustomer): any {
    return {
      style: 'customerInfo',
      columns: [
        [
          { text: `Cliente: ${groupedCustomer.customerCode} - ${groupedCustomer.customerName}` },
          { text: `Vendedor: ${groupedCustomer.sellerName}` }
        ],
        {
          stack: [
            { text: `Saldo Total: ${this.formatCurrency(groupedCustomer.totalBalance)}`, alignment: 'right' },
            { text: `Total Pagado: ${this.formatCurrency(groupedCustomer.totalPaidToDate)}`, alignment: 'right' }
          ]
        }
      ]
    };
  }

  private getDetailsTable(details: DocumentSaleModel[]): any {
    const totalDocTotal = details.reduce((sum, item) => sum + item.docTotal, 0);
    const totalBalance = details.reduce((sum, item) => sum + item.balance, 0);
    const totalPaid = details.reduce((sum, item) => sum + item.paidToDate, 0);

    return {
      style: 'tableExample',
      table: {
        headerRows: 1,
        widths: ['10%', '15%', '15%', '10%', '20%', '15%', '15%'],
        body: [
          [
            { text: 'Fact. N°', style: 'tableHeader' },
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Vencimiento', style: 'tableHeader' },
            { text: 'Días Vencidos', style: 'tableHeader' },
            { text: 'Valor Original', style: 'tableHeader' },
            { text: 'Pagado', style: 'tableHeader' },
            { text: 'Saldo', style: 'tableHeader' }
          ],
          ...details.map(item => {
            const daysOverdue = this.calculateDaysOverdue(item.dueDate);
            return [
              { text: item.docId, fontSize: 10, alignment: 'right' },
              { text: this.formatDate(item.docDate), fontSize: 10, alignment: 'right' },
              { text: this.formatDate(item.dueDate), fontSize: 10, alignment: 'right' },
              {
                text: daysOverdue > 0 ? daysOverdue.toString() : '0',
                color: daysOverdue > 0 ? 'red' : 'black',
                fontSize: 10,
                alignment: 'right'
              },
              { text: this.formatCurrency(item.docTotal), fontSize: 10, alignment: 'right' },
              { text: this.formatCurrency(item.paidToDate), fontSize: 10, alignment: 'right' },
              { text: this.formatCurrency(item.balance), fontSize: 10, alignment: 'right' }
            ];
          }),
          [
            { text: 'Total', colSpan: 4, style: 'tableFooter', alignment: 'right' },
            {}, {}, {},
            { text: this.formatCurrency(totalDocTotal), style: 'tableFooter', alignment: 'right' },
            { text: this.formatCurrency(totalPaid), style: 'tableFooter', alignment: 'right' },
            { text: this.formatCurrency(totalBalance), style: 'tableFooter', alignment: 'right' }
          ]
        ]
      },
      layout: 'noBorders'
    };
  }

  private calculateDaysOverdue(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }


  private getFooter(): any {
    return (currentPage, pageCount) => ({
      text: `Página ${currentPage} de ${pageCount}`,
      alignment: 'center',
      style: 'footer'
    });
  }

  private getStyles(): any {
    return {
      title: {
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      companyName: {
        fontSize: 14,
        bold: true
      },
      companyInfo: {
        fontSize: 10
      },
      customerInfo: {
        fontSize: 10,
        margin: [0, 0, 0, 20]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: 'black',
        fillColor: '#eeeeee',
        alignment: 'right',
      },
      tableFooter: {
        bold: true,
        fontSize: 10,
        color: 'black',
        fillColor: '#eeeeee',
        alignment: 'center'
      },
      footer: {
        fontSize: 10,
        margin: [0, 10, 0, 0]
      }
    };
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(value);
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-HN');
  }

  private async getBase64Logo(): Promise<string> {
    const companyLogoBase64 = localStorage.getItem('companyLogo');
    return companyLogoBase64 || '';
  }
}
