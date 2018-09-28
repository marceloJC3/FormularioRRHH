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
//import N_DiaAdmin from './../LSNegocio/N_DiaAdmin';
import N_Empleado from './../LSNegocio/N_Empleado';
import N_Usuario from './../LSNegocio/N_Usuario';
import { I_Empleado, I_Area, I_Usuario, I_DiaAdmin, I_Rol, I_OperacionInterna } from '../LSNegocio/Interfaces';
import { H_QueryString } from '../LSNegocio/Helper';



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

  private L_Empleado: I_Empleado = null;

  private txt_diaAdministrativo: Element;

  private txt_user: Element;

  private txt_diaDisponible: Element;

  private btn_enviar: Element;

  private btn_cancelar: Element;

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


    SPComponentLoader.loadCss('//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');


  }


  public render(): void {

    switch (this.properties.tipoFormulario) {
      case M_Lista.D_TipoVista[0].key:

        this.obtener_informacionCrear().then(OP => {

          this.domElement.innerHTML = OP.Estado ? Template.HTMLCrear : Template.HTMLError;
          if (OP.Estado) {
            this.FillControlCrear();
            //    this.CargarInformacionInicial();
          }


        });


        break;

      case M_Lista.D_TipoVista[1].key:

        break;

      case M_Lista.D_TipoVista[2].key:

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

            resolve(operacion);

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
    this.btn_enviar = this.domElement.querySelector("#btnEnviar");
    this.btn_enviar.addEventListener("click", () => {

      alert("Crear Elemento");//this.CrearForm();

    });

    $("#txtDia").datepicker(this.DatePickerOptions);

    $("#txtUser").val(this.ctx_usuario.Email).attr('data-info', this.ctx_usuario.Id);

    (<HTMLInputElement>this.txt_diaAdministrativo).value = this.L_Empleado.DiaAdministrativo.toString();

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
                  label: strings.DescriptionFieldLabel
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
