import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CompanyInfo } from 'src/app/models/company-info';
import { CommonService } from 'src/app/service/common.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfBalanceService {
    constructor(private commonService: CommonService) {}

    public async generatePDF(journalList: any[], from: Date, to: Date): Promise<void> {
      const documentDefinition = await this.getDocumentDefinition(journalList, from, to);
      pdfMake.createPdf(documentDefinition).download(`Estado_de_cuenta_${journalList[0].customerCode}.pdf`);
    }

    private async getDocumentDefinition(journalList: any[], from: Date, to: Date): Promise<any> {
      const companyInfo = await this.commonService.companyInfo();
      const logo = await this.getBase64Logo(); // Método para obtener el logo en base64

      return {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: (currentPage) => {
            if (currentPage === 1) {
              return this.getHeader(companyInfo, logo);
            }
            return null;
          },
        content: [
          { text: 'Estado de Cuenta', style: 'title' },
          this.getCustomerInfo(journalList, from, to),
          this.getJournalListTable(journalList)
        ],
        footer: this.getFooter(),
        styles: this.getStyles()
      };
    }

    private getHeader(companyInfo: CompanyInfo, logo: string): any {
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
        margin: [40, 20, 40, 20]
      };
    }

    private getCustomerInfo(journalList: any[], from: Date, to: Date): any {
      return {
        style: 'customerInfo',
        columns: [
          [
            { text: `Cliente: ${journalList[0].customerCode} - ${journalList[0].customerName}` },
            { text: `Saldo Acumulado: ${this.formatCurrency(journalList[0].saldoAnterior)}` }
          ],
          [
            { text: `Desde: ${from}` },
            { text: `Hasta: ${to}` }
          ]
        ]
      };
    }

    private getJournalListTable(journalList: any[]): any {
      return {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 100, 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Fecha', style: 'tableHeader' },
              { text: 'Documento', style: 'tableHeader' },
              { text: 'Referencia', style: 'tableHeader' },
              { text: 'Condición', style: 'tableHeader' },
              { text: 'Debe', style: 'tableHeader' },
              { text: 'Haber', style: 'tableHeader' },
              { text: 'Saldo', style: 'tableHeader' }
            ],
            ...journalList.map(item => [
              new Date(item.fecha).toLocaleDateString(),
              item.documents,
              { text: item.referencia, width: 100 },
              item.condicion,
              { text: this.formatCurrency(item.debe), alignment: 'right' },
              { text: this.formatCurrency(item.haber), alignment: 'right' },
              { text: this.formatCurrency(item.balance), alignment: 'right' }
            ])
          ]
        }
      };
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
          fontSize: 12,
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
          fontSize: 10,
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black',
          fillColor: '#eeeeee',
          alignment: 'center'
        },
        footer: {
          fontSize: 9,
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

    private async getBase64Logo(): Promise<string> {
        const companyLogoBase64 = localStorage.getItem('companyLogo');
      return companyLogoBase64;
    }
  }
