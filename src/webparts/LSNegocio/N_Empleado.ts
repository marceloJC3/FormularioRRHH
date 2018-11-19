import { I_Area, I_Empleado, I_Usuario } from './Interfaces';
import M_Lista from './M_Lista';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import pnp, { List, ListEnsureResult, ItemAddResult, FieldAddResult, CamlQuery } from 'sp-pnp-js';


export default class N_Empleado implements I_Empleado {

    ID: number;
    Title: string;
    Usuario?: I_Usuario;
    UsuarioId?: number;
    Area?: I_Area;
    AreaId?: number;
    DiaAdministrativo?: number;



    constructor() {

    }

    public obtenerEmpleadoActual(usuarioId: number): Promise<I_Empleado> {

        return new Promise<I_Empleado>((resolve) => {

            if (Environment.type === EnvironmentType.Local) {


            } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {

                pnp.sp.web.lists.getByTitle(M_Lista.D_Lista.listaEmpleado).items
                    .select("*","Title", "DiaAdministrativo", "Area/Title", "Area/ID","Usuario/Title","Usuario/EMail")
                    .filter(`UsuarioId eq '${usuarioId}'`)
                    .expand("Area","Usuario")
                    .top(1)
                    .get().then((data: any) => {
                        if (data.length > 0) {
                            debugger;
                            resolve(data[0]);
                        }
                    });

            }
        });
    }


}
