import { I_Area, I_Empleado, I_Usuario, I_DiaAdmin} from './Interfaces';
import M_Lista from './M_Lista';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import pnp, { List, ListEnsureResult, ItemAddResult, FieldAddResult, CamlQuery } from 'sp-pnp-js';


export default class N_DiaAdmin implements I_DiaAdmin {

    public ID: number;
    public Title: string;
    public DiaASolicitar?: Date;
    public Solicitante?: I_Usuario;
    public SolicitanteId?: number;
    public DiasHabiles?: number;
    public Aprobador?: I_Usuario;
    public AprobadorId?: number;
    public FechaAprobacion?: string;
    public MotivoRechazo?: string;
    public EstadoSolicitud?: string;
    public DiasSolicitados?: number;
    public CargoAprobador?: string;    



    constructor() {

    }

    public obtenerDiaAdministrativo(IdDiaAdmin: number): Promise<I_Empleado> {

        return new Promise<I_Empleado>((resolve) => {

            if (Environment.type === EnvironmentType.Local) {


            } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {

                pnp.sp.web.lists.getByTitle(M_Lista.D_Lista.listaDiaAdministrativo).items
                    .select("*","Solicitante/Title","Solicitante/EMail","Aprobador/Title","Aprobador/EMail")
                    .filter(`ID eq '${IdDiaAdmin}'`)
                    .expand("Solicitante","Aprobador")
                    .top(1)
                    .get().then((data: any) => {
                        if (data.length > 0) {
                            resolve(data[0]);
                        }
                    });

            }
        });
    }

       public  GuardarSimple(diaAdmin: I_DiaAdmin): Promise<boolean> {
        return new Promise<boolean>((resolve) => {

            if (Environment.type === EnvironmentType.Local) {
                console.log("agregar app");

            } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
                pnp.sp.web.lists.getByTitle(M_Lista.D_Lista.listaDiaAdministrativo).items.add(diaAdmin).then((iar: ItemAddResult) => {
                    resolve(true);
                });

            }
        });
    }


}
