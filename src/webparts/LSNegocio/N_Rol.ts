import { I_Rol,I_Area,I_Usuario } from './Interfaces';
import M_Lista from './M_Lista';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import pnp, { List, ListEnsureResult, ItemAddResult, FieldAddResult, CamlQuery } from 'sp-pnp-js';

export default class N_Rol implements I_Rol {

    ID?: number;
    Title?: string;
    EstadoFuncionario?: string;
    Area?: I_Area;
    AreaId?: number;
    Cargo?: string;
    Usuario?: I_Usuario;
    UsuarioId?: number;

    constructor() {

    }

    public obtenerRolesActual(areaId: number): Promise<I_Rol[]> {

        return new Promise<I_Rol[]>((resolve) => {

            if (Environment.type === EnvironmentType.Local) {


            } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {

                pnp.sp.web.lists.getByTitle(M_Lista.D_Lista.listaRoles).items
                    .select("*", "Title", "EstadoFuncionario","Cargo", "Area/Title", "Area/ID", "Usuario/Title", "Usuario/EMail")
                    .filter(`AreaId eq '${areaId}'`)
                    .expand("Area", "Usuario")
                    .top(2)
                    .get().then((data: any) => {
                        if (data.length > 0) {
                            resolve(data[0]);
                        }
                    });

            }
        });
    }


     public obtenerRolActual(areaId: number): Promise<I_Rol> {

        return new Promise<I_Rol>((resolve) => {

            if (Environment.type === EnvironmentType.Local) {


            } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {

                pnp.sp.web.lists.getByTitle(M_Lista.D_Lista.listaRoles).items
                    .select("*", "Title", "EstadoFuncionario","Cargo", "Area/Title", "Area/ID","Usuario/ID", "Usuario/Title", "Usuario/EMail")
                    .filter(`AreaId eq '${areaId}' and EstadoFuncionario eq 'Activo'`)
                    .expand("Area", "Usuario")
                    .top(1)
                    .get().then((data: any) => {
                        if (data.length > 0) {
                            resolve(data[0]);
                        }
                    });

            }
        });
    }

    
     public obtenerRolActualRRHH(area: string): Promise<I_Rol> {

        return new Promise<I_Rol>((resolve) => {

            if (Environment.type === EnvironmentType.Local) {


            } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {

                pnp.sp.web.lists.getByTitle(M_Lista.D_Lista.listaRoles).items
                    .select("*", "Title", "EstadoFuncionario","Cargo", "Area/Title", "Area/ID", "Usuario/Title","Usuario/ID", "Usuario/EMail")
                    .filter(`Area/Title eq '${area}' and EstadoFuncionario eq 'Activo'`)
                    .expand("Area", "Usuario")
                    .top(1)
                    .get().then((data: any) => {
                        if (data.length > 0) {
                            resolve(data[0]);
                        }
                    });

            }
        });
    }


}