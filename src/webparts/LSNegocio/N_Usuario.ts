import {I_Usuario} from './Interfaces';
import M_Lista from './M_Lista';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import pnp, { List, ListEnsureResult, ItemAddResult, FieldAddResult, CamlQuery } from 'sp-pnp-js';


export default class N_Usuario implements I_Usuario {

    public ID: number;
    public Title: string;
    public Email?: string;
    public LoginName?: string;
    

    constructor() {

    }

    public obtenerUsuarioActual(): Promise<I_Usuario> {

        return new Promise<I_Usuario>((resolve) => {

            if (Environment.type === EnvironmentType.Local) {
                

            } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {

                pnp.sp.web.currentUser.get().then((r) => {
                
                    resolve(r);

                });

            }
        });
    }
  
 
}


        