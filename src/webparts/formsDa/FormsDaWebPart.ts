import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './FormsDaWebPart.module.scss';
import * as strings from 'FormsDaWebPartStrings';

export interface IFormsDaWebPartProps {
  description: string;
  tipoFormulario: string;
}


import Template from './HTML/Template';
import M_Lista from '../LSNegocio/M_Lista';
import N_DiaAdmin from './../LSNegocio/N_DiaAdmin';
import N_Empleado from './../LSNegocio/N_Empleado';
import N_Usuario from './../LSNegocio/N_Usuario';
import N_Rol from './../LSNegocio/N_Rol';
import { I_Empleado, I_Area, I_Usuario, I_DiaAdmin, I_Rol, I_OperacionInterna } from '../LSNegocio/Interfaces';
import { H_QueryString, H_Function } from '../LSNegocio/Helper';



import { SPComponentLoader } from '@microsoft/sp-loader';

import * as $ from 'jquery';
import 'jqueryui';

require("./HTML/styleForms.css");

/*
Obtener el usuario concurrente.

Preguntar por ese usuario, traer datos del Empleado, extender el area.

Obtener los usuarios activos asociados al area

Crear usuario Aprobador delegado


*/


export default class FormsDaWebPart extends BaseClientSideWebPart<IFormsDaWebPartProps> {

  /* Creacion */

  private ctx_usuario: I_Usuario = null;
  private ctx_aprobador: I_Usuario = null;

  private L_Roles: I_Rol[] = [];

  private L_Rol: I_Rol = null;
  private L_RolRRHH: I_Rol = null;

  private L_Empleado: I_Empleado = null;

  private L_DiaAdmin: I_DiaAdmin = null;

  private txt_diaAdministrativo: Element;

  private txt_user: Element;

  private txt_diaDisponible: Element;

  private btn_enviar: Element;

  private btn_cancelar: Element;


  /*Aprobacion*/

  private txt_userAprobador: Element;

  private txt_cargo: Element;

  private txt_mensaje: Element;

  private txt_fechaRespuesta: Element;

  private txt_estado: Element;

  private btn_exportar: Element;

  private txt_numDias: Element;

  private btn_Aprobar: Element;

  private btn_Rechazar: Element;


  private DatePickerOptions: JQueryUI.DatepickerOptions = {
    dateFormat: "dd/mm/yy",
    defaultDate: "+1w",
    minDate: +14,
    changeMonth: true,
    numberOfMonths: 1,
    beforeShowDay: $.datepicker.noWeekends
  }

  constructor() {
    super();

    SPComponentLoader.loadCss('//https://latinshare.sharepoint.com/sites/rrhh/_catalogs/masterpage/RRHH/css/responsive.css');
    SPComponentLoader.loadCss('//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');


  }


  public render(): void {

    switch (this.properties.tipoFormulario) {
      case M_Lista.D_TipoVista[0].key:

        this.obtener_informacionCrear().then(OP => {

          this.domElement.innerHTML = OP.Estado ? Template.HTMLCrear : Template.HTMLError;
          if (OP.Estado) {

            this.FillControlCrear();

          }


        });


        break;

      case M_Lista.D_TipoVista[1].key:

        this.obtener_informacionEditar().then(OP => {

          this.domElement.innerHTML = OP.Estado ? Template.HTMLEdicion : Template.HTMLError;
          if (OP.Estado) {

            this.FillControlEditar();

          }


        });



        break;

      case M_Lista.D_TipoVista[2].key:


        this.obtener_informacionLectura().then(OP => {

          this.domElement.innerHTML = OP.Estado ? Template.HTMLLectura : Template.HTMLError;
          if (OP.Estado) {
            this.FillControlLectura();
          }


        });

        break;

      default:
        this.domElement.innerHTML = Template.HTMLError;
        break;
    }

  }


  private obtener_informacionCrear(): Promise<I_OperacionInterna> {
    return new Promise<I_OperacionInterna>((resolve) => {

      let flag: boolean = false;
      let operacion: I_OperacionInterna = null;

      new N_Usuario().obtenerUsuarioActual().then((usuarioConcurrente) => {

        this.ctx_usuario = usuarioConcurrente;
        flag = (this.ctx_usuario != null) ? true : false;

        if (flag) {

          new N_Empleado().obtenerEmpleadoActual(this.ctx_usuario.Id).then((empleado) => {
            this.L_Empleado = empleado;
            operacion = (this.L_Empleado != null) ? { ID: 1, Estado: true, Mensaje: "OK" } : { ID: 1, Estado: true, Mensaje: "Fallo el obtener Empleado" };

            if (operacion.Estado) {

              new N_Rol().obtenerRolActual(this.L_Empleado.AreaId).then((rol) => {

                this.L_Rol = rol;
                operacion = (this.L_Rol != null) ? { ID: 1, Estado: true, Mensaje: "OK" } : { ID: 1, Estado: true, Mensaje: "Fallo el obtener Roles" };

                resolve(operacion);


              });

            }

          });


        } else {

          operacion = { ID: 0, Estado: flag, Mensaje: "Error al obtener el usuario" };

          resolve(operacion);

        }



      });
      //Obtencion de Datos desde mocks o shp, buscar el error


    });
  }


  private obtener_informacionEditar(): Promise<I_OperacionInterna> {
    return new Promise<I_OperacionInterna>((resolve) => {

      let flag: boolean = false;
      let operacion: I_OperacionInterna = null;
      let vID: string = H_QueryString.getParameter("ID", "");

      new N_Usuario().obtenerUsuarioActual().then((usuarioConcurrente) => {

        this.ctx_usuario = usuarioConcurrente;
        flag = (this.ctx_usuario != null) ? true : false;

        if (flag) {

          new N_Empleado().obtenerEmpleadoActual(this.ctx_usuario.Id).then((empleado) => {
            this.L_Empleado = empleado;
            operacion = (this.L_Empleado != null) ? { ID: 1, Estado: true, Mensaje: "OK" } : { ID: 1, Estado: true, Mensaje: "Fallo el obtener Empleado" };

            if (operacion.Estado) {

              new N_Rol().obtenerRolActualRRHH("Administracion y RRHH").then((rol) => {


                this.L_RolRRHH = rol;
                operacion = (this.L_Rol != null) ? { ID: 1, Estado: true, Mensaje: "OK" } : { ID: 1, Estado: true, Mensaje: "Fallo el obtener Roles" };


                new N_DiaAdmin().obtenerDiaAdministrativo(vID).then((diaAdmin) => {

                  this.L_DiaAdmin = diaAdmin;
                  operacion = (this.L_DiaAdmin != null) ? { ID: 1, Estado: true, Mensaje: "OK" } : { ID: 1, Estado: true, Mensaje: "Fallo el obtener Dia Admin" };

                  resolve(operacion);

                });



              });

            } else {

              operacion = { ID: 0, Estado: flag, Mensaje: "Error al obtener el Empleado" };

              resolve(operacion);

            }

          });


        } else {

          operacion = { ID: 0, Estado: flag, Mensaje: "Error al obtener el usuario" };

          resolve(operacion);

        }



      });

      //Obtencion de Datos desde mocks o shp, buscar el error


    });
  }

  private FillControlCrear(): void {

    $.datepicker.regional['es'] = {
      closeText: 'Cerrar',
      prevText: 'Ant',
      nextText: 'Sig',
      currentText: 'Hoy',
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
      weekHeader: 'Sm',
      dateFormat: 'dd/mm/yy',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''
    };

    $.datepicker.setDefaults($.datepicker.regional['es']);

    //Definir todos los campos asociados al webpart
    this.txt_diaAdministrativo = this.domElement.querySelector("#txtDisponible");
    this.txt_user = this.domElement.querySelector("#txtUser");

    this.txt_diaDisponible = this.domElement.querySelector("#txtDia");
    this.btn_cancelar = this.domElement.querySelector("#btnCancelar");
    this.btn_cancelar.addEventListener("click", () => {

      window.location.href = this.properties.description;
      //window.location.href = '../../Paginas/Formularios.aspx'; 

    });

    this.btn_enviar = this.domElement.querySelector("#btnEnviar");
    this.btn_enviar.addEventListener("click", () => {

      this.CrearDiaAdmin();

    });

    $("#txtDia").datepicker(this.DatePickerOptions);

    $("#txtUser").val(this.ctx_usuario.Email).attr('data-info', this.ctx_usuario.Id);

    (<HTMLInputElement>this.txt_diaAdministrativo).value = this.L_Empleado.DiaAdministrativo.toString();

    if (this.L_Empleado.DiaAdministrativo > 0) {

      $("#txtDia,#btnEnviar").show();


    } else {

      $("#txtDia,#btnEnviar,#boxDiaSolicitar").hide();
      $(".boton-enviar").append("<p>No tiene dias disponibles</p>");

    }

  }

  private FillControlEditar(): void {

    let fecha = H_Function.convertDateInverse(this.L_DiaAdmin.DiaASolicitar);
    //Definir todos los campos asociados al webpart
    this.txt_diaAdministrativo = this.domElement.querySelector("#txtDisponible");
    this.txt_user = this.domElement.querySelector("#txtUser");
    this.txt_numDias = this.domElement.querySelector("#txtNumDiaSolicitar");
    this.txt_diaDisponible = this.domElement.querySelector("#txtFecha");


    this.txt_estado = this.domElement.querySelector("#txtEstado");
    this.txt_fechaRespuesta = this.domElement.querySelector("#txtEstado");
    this.txt_userAprobador = this.domElement.querySelector("#txtUser2");
    this.txt_cargo = this.domElement.querySelector("#txtCargo");
    this.txt_mensaje = this.domElement.querySelector("#txtMotivo");

    this.btn_Aprobar = this.domElement.querySelector("#btnAprobar");
    this.btn_Rechazar = this.domElement.querySelector("#btnRechazar");

    (<HTMLInputElement>this.txt_user).value = this.L_DiaAdmin.Solicitante.EMail;

    (<HTMLInputElement>this.txt_diaAdministrativo).value = "1";//this.L_Empleado.DiaAdministrativo.toString();
    (<HTMLInputElement>this.txt_numDias).value = "1";
    (<HTMLInputElement>this.txt_diaDisponible).value = fecha;
    (<HTMLInputElement>this.txt_diaDisponible).disabled = true;

    (<HTMLInputElement>this.txt_userAprobador).value = this.L_DiaAdmin.Aprobador.EMail;
    (<HTMLInputElement>this.txt_cargo).value = this.L_DiaAdmin.CargoAprobador;
    (<HTMLInputElement>this.txt_estado).value = this.L_DiaAdmin.EstadoSolicitud;
    (<HTMLInputElement>this.txt_mensaje).value = this.L_DiaAdmin.MotivoRechazo;


    switch (this.L_DiaAdmin.EstadoSolicitud) {
      case M_Lista.D_EstadoFormulario.Pendiente_Aprobacion_RRHH:
        //Valido Usuario
        if (this.ctx_usuario.Id == this.L_RolRRHH.Usuario.ID) {
          //Muestro Botones 
          $("#pnlAprobador").show();
          $("#pnlBotnesAprobacion").show();
          this.btn_Aprobar.addEventListener("click", () => {

            this.EditarDiaAdmin(this.L_DiaAdmin.ID, M_Lista.D_EstadoFormulario.Aprobado_RRHH, "Aprobar");
            console.log("Actualizo Elemento");//this.CrearForm();

          });

          this.btn_Rechazar.addEventListener("click", () => {

            this.EditarDiaAdmin(this.L_DiaAdmin.ID, M_Lista.D_EstadoFormulario.Rechazado_RRHH, "Rechazar");
            console.log("Actualizo Elemento Rechazado");//this.CrearForm();


          });

        } else {

          if (this.ctx_usuario.Id == this.L_DiaAdmin.Solicitante.ID) {
            $("#pnlAprobador").show();
            $("#pnlBotnesAprobacion").hide();

          } else {
            $("#pnlAprobador").hide();
            $("#contenedor").html(` <div class="input">
                                      <p>No tiene permisos para ver este elemento, contactese con el administrador</p>
                                   </div>`);
          }

        }

        break;

      case M_Lista.D_EstadoFormulario.Aprobado_RRHH:
        if (this.ctx_usuario.Id == this.L_DiaAdmin.Aprobador.ID) {

          //Muestro Botones 

          $("#pnlAprobador").show();
          $("#pnlBotnesAprobacion").show();

          this.btn_Aprobar.addEventListener("click", () => {

            this.EditarDiaAdmin(this.L_DiaAdmin.ID, M_Lista.D_EstadoFormulario.Aprobado, "Aprobar");
            console.log("Actualizo Elemento 2 Aprobacion");//this.CrearForm();

          });

          this.btn_Rechazar.addEventListener("click", () => {


            this.EditarDiaAdmin(this.L_DiaAdmin.ID, M_Lista.D_EstadoFormulario.Rechazado, "Rechazar");
            console.log("Actualizo Elemento Rechazado");//this.CrearForm();


          });

        } else {
          if (this.ctx_usuario.Id == this.L_DiaAdmin.Solicitante.ID) {
            $("#pnlAprobador").show();

            $("#pnlAprobador > .input").hide();

            $("#pnlBotnesAprobacion").hide();

            $("#pnlEstadoSolicitud").show();



          } else {
            $("#pnlAprobador").hide();
            $("#contenedor").html(` <div class="input">
                                      <p>No tiene permisos para ver este elemento, contactese con el administrador</p>
                                   </div>`);
            //Deberia Poner un mensaje que no tiene permisos para ver este formulario
          }


        }

        break;


      case M_Lista.D_EstadoFormulario.Rechazado_RRHH:
        if (this.ctx_usuario.Id == this.L_DiaAdmin.Aprobador.ID) {

          //Muestro Botones 

          $("#pnlAprobador").show();
          $("#pnlBotnesAprobacion").hide();

          //Valido

        } else {
          if (this.ctx_usuario.Id == this.L_DiaAdmin.Solicitante.ID) {
            $("#pnlAprobador").show();
            $("#pnlAprobador > .input").hide();

            $("#pnlBotnesAprobacion").hide();

            $("#pnlEstadoSolicitud,#pnlMotivoRechazo").show();

          } else {
            $("#pnlAprobador").hide();
            $("#contenedor").html(` <div class="input">
                                      <p>No tiene permisos para ver este elemento, contactese con el administrador</p>
                                   </div>`);
          }


        }

        break;

      case M_Lista.D_EstadoFormulario.Rechazado:

        (<HTMLInputElement>this.txt_mensaje).disabled = true;
        if (this.ctx_usuario.Id == this.L_DiaAdmin.Aprobador.ID) {
          //Muestro Botones 
          $("#pnlAprobador").show();
          $("#pnlBotnesAprobacion").hide();

          //Valido

        } else {
          if (this.ctx_usuario.Id == this.L_DiaAdmin.Solicitante.ID) {
            $("#pnlAprobador").show();
            $("#pnlBotnesAprobacion").hide();

          } else {
            $("#pnlAprobador").hide();
            $("#contenedor").html(` <div class="input">
                                      <p>No tiene permisos para ver este elemento, contactese con el administrador</p>
                                   </div>`);
          }


        }

        break;


      case M_Lista.D_EstadoFormulario.Aprobado:
        if (this.ctx_usuario.Id == this.L_DiaAdmin.Aprobador.ID) {

          //Muestro Botones 

          $("#pnlAprobador").show();
          $("#pnlBotnesAprobacion").hide();

          //Valido

        } else {
          if (this.ctx_usuario.Id == this.L_DiaAdmin.Solicitante.ID) {
            $("#pnlAprobador").show();
            $("#pnlBotnesAprobacion,#pnlMotivoRechazo").hide();

          } else {
            $("#pnlAprobador").hide();
            $("#contenedor").html(` <div class="input">
                                      <p>No tiene permisos para ver este elemento, contactese con el administrador</p>
                                   </div>`);
          }


        }

        break;

      default:
        $("#pnlAprobador").hide();
        $("#contenedor").html(` <div class="input">
                                      <p>No tiene permisos para ver este elemento, contactese con el administrador</p>
                                   </div>`);
        break;
    }



  }

  private CrearDiaAdmin(): void {

    let hoy = new Date();
    let fechaSolicitar = $("#txtDia").val();
    let nombre = "FDA-" + hoy.getMonth().toString() + "-" + hoy.getFullYear().toString()
    let diaAdmin = new N_DiaAdmin();
    diaAdmin.Title = nombre;
    diaAdmin.EstadoSolicitud = M_Lista.D_EstadoFormulario.Pendiente_Aprobacion_RRHH;
    diaAdmin.DiasSolicitados = 1;
    diaAdmin.DiaASolicitar = H_Function.convertDate(fechaSolicitar);
    diaAdmin.SolicitanteId = this.ctx_usuario.Id;
    diaAdmin.AprobadorId = this.L_Rol.UsuarioId;//Filtrar previamente cual esta activo
    diaAdmin.CargoAprobador = this.L_Rol.Cargo;

    if (fechaSolicitar == "") {

      alert("Si vas a enviar, debes ingresar de forma obligatoria el campo dia a Solicitar.")

    } else {

      new N_DiaAdmin().GuardarSimple(diaAdmin).then((flag) => {

        if (flag) {

          alert("Se guardo Exitosamente");

        } else {

          alert("Ocurrio un problema.");
        }

      });


    }



  }

  private EditarDiaAdmin(id: number, estado: string, accion: string): void {

    let hoy = new Date();

    let diaAdmin = new N_DiaAdmin();
    diaAdmin.ID = id;
    diaAdmin.EstadoSolicitud = estado;

    if (accion == "Rechazar") {

      let motivoRechazo: string = (<HTMLInputElement>this.txt_mensaje).value;
      if (motivoRechazo == "") {

        alert("Si vas a rechazar, debes ingresar de forma obligatoria el campo Motivo de Rechazo.")

      } else {

        diaAdmin.MotivoRechazo = motivoRechazo;

        new N_DiaAdmin().ActualizarDiaAdmin(diaAdmin).then((flag) => {

          if (flag) {

            alert("Se guardo Exitosamente");
            window.location.href = this.properties.description;

          } else {

            alert("Ocurrio un problema.");
          }

        });
      }

    } else {

      //Aprobar
      new N_DiaAdmin().ActualizarDiaAdmin(diaAdmin).then((flag) => {

        if (flag) {

          alert("Se guardo Exitosamente");
          window.location.href = this.properties.description;
        } else {

          alert("Ocurrio un problema.");
        }

      });

    }



  }

  private obtener_informacionLectura(): Promise<I_OperacionInterna> {
    return new Promise<I_OperacionInterna>((resolve) => {

      let flag: boolean = false;
      let vID: string = H_QueryString.getParameter("vID", "");
      let operacion: I_OperacionInterna = null;
      let idDiaAdmin: string = (vID != "") ? vID : "1";

      new N_Usuario().obtenerUsuarioActual().then((usuarioConcurrente) => {

        this.ctx_usuario = usuarioConcurrente;

        flag = (this.ctx_usuario != null) ? true : false;

        if (flag) {


          new N_DiaAdmin().obtenerDiaAdministrativo(idDiaAdmin).then((diaAdmin) => {

            this.L_DiaAdmin = diaAdmin;
            operacion = (this.L_DiaAdmin != null) ? { ID: 1, Estado: true, Mensaje: "OK" } : { ID: 1, Estado: true, Mensaje: "Fallo el obtener DiaAdministrativo" };
            resolve(operacion);

          });
        } else {

          operacion = { ID: 0, Estado: flag, Mensaje: "Error al obtener el usuario" };

          resolve(operacion);

        }

      });


    });
  }

  private FillControlLectura(): void {


    //Definir todos los campos asociados al webpart
    this.txt_diaAdministrativo = this.domElement.querySelector("#txtDisponible");
    this.txt_user = this.domElement.querySelector("#txtUser");
    this.txt_diaDisponible = this.domElement.querySelector("#txtDia");
    this.txt_userAprobador = this.domElement.querySelector("txtUser2");
    this.txt_cargo = this.domElement.querySelector("txtCargo");
    this.txt_mensaje = this.domElement.querySelector("txtMotivo");
    this.txt_fechaRespuesta = this.domElement.querySelector("txtFecha");
    this.txt_estado = this.domElement.querySelector("txtEstado");

    (<HTMLInputElement>this.txt_diaAdministrativo).value = this.L_DiaAdmin.DiaASolicitar.toString();
    (<HTMLInputElement>this.txt_user).value = this.L_DiaAdmin.Solicitante.Title;
    (<HTMLInputElement>this.txt_diaDisponible).value = this.L_DiaAdmin.DiasSolicitados.toString();//Evaluar
    (<HTMLInputElement>this.txt_userAprobador).value = this.L_DiaAdmin.Aprobador.Title;
    (<HTMLInputElement>this.txt_cargo).value = this.L_DiaAdmin.CargoAprobador;
    //(<HTMLInputElement>this.txt_mensaje).value =this.L_DiaAdmin.MotivoRechazo;
    (<HTMLInputElement>this.txt_fechaRespuesta).value = this.L_DiaAdmin.FechaAprobacion.toString();
    (<HTMLInputElement>this.txt_estado).value = this.L_DiaAdmin.EstadoSolicitud;

    $("#pnlAprobador").show();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "URL de Retorno"
                }),
                PropertyPaneDropdown('tipoFormulario', {
                  label: "Selecione un tipo de formulario",
                  options: M_Lista.D_TipoVista
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
