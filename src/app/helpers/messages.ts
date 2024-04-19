import Swal from 'sweetalert2'

export module Messages {
    export function ok(titulo: string = "", mensaje = ""):Promise<boolean> {
        let promesa = new Promise<boolean>((resolve) => {
            Swal.fire({
            icon: "success",
            title: titulo,
            text: mensaje,
            }).then(x=>{
            resolve(true)
            });
        })
    return promesa;
    }

    export function warning(title: string ,message = ""):Promise<boolean> {
        let promesa = new Promise<boolean>((resolve, reject) => {
            Swal.fire({
            // imageUrl: 'https://placeholder.pics/svg/300x1500',
            // imageHeight: 1500,
            // imageAlt: 'A tall image',
            icon: "warning",
            title: title,
            confirmButtonText:'Aceptar',
            allowOutsideClick: false,
            text: message,
            }).then(()=>{
                resolve(true)
            }).catch(()=> {
              reject()
            })
        })
    return promesa;
    }

    export function loading(title: string, message: string)
    {
        Swal.fire({
            title: title,
            text: message,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
    }



    export function closeLoading()
    {
      try{
        Swal.close();
      }
      catch(error)
      {

      }
    }

    export async function question(titulo: string, mensaje: string, confirmButtonText = "Sí", cancelButtonText = "No"): Promise<boolean> {
        var result = await Swal.fire({
          title: titulo,
          text: mensaje,
          icon: 'question',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          confirmButtonColor: '#5e72e4',
          confirmButtonText: `<i class="pi pi-check"></i> ${confirmButtonText}`,
          cancelButtonText: `${cancelButtonText}`,
          allowOutsideClick: false,
        });
        return result.value;
    }

      export function Toas(body:string, icon: any  = 'success')
      {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: icon,
            title: body
          })
      }


    //   export function Toast(cuerpo:string, icon: string  = 'success',tiempo:number)
    //   {
    //     const Toast = Swal.mixin({
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: tiempo,
    //         timerProgressBar: true,
    //         onOpen: (toast) => {
    //           toast.addEventListener('mouseenter', Swal.stopTimer)
    //           toast.addEventListener('mouseleave', Swal.resumeTimer)
    //         }
    //       })

    //       Toast.fire({
    //         icon: icon,
    //         title: cuerpo
    //       })
    //   }

}
