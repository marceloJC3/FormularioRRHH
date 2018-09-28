export default class TemplateHTML {

    public static HTMLCrear: string = `
    <div class="main">
        <div class="formulario" id="formulario">
            <div class="titulo">
                <h3>Solicitud de día administrativo </h3>
            </div>
            <div name="vacaciones">
                <div class="input">
                    <p>Realizado por:</p>
                    <input type="text" name="nombre" value="" id="txtUser" disabled="">
                </div>
                <div class="input">
                    <p>Disponible:</p>
                    <input type="text" name="nombre" value="" id="txtDisponible" disabled="">
                </div>
               <div class="input">
                    <p>Día a solicitar: </p><div class="rojo">(*)</div><p></p><input type="text" id="txtDia" name="desde" readonly>
                </div>
            <div class="boton-enviar">
                <input id="btnEnviar" type="button" value="Enviar Solicitud" style="display:inline;">  
                <input id="btnCancelar" type="button" value="Cancelar" style="display:inline;float:left">
            </div>
            </div>
        </div>
    </div>`;


    public static HTMLLectura: string = `
    <div class="main">
    	<div class="formulario" id="formulario">
            <div class="titulo">
                <h3>Solicitud de día administrativo </h3>
            </div>
            <div id="contenedor">
                <div class="input">
                    <p>Realizada por:</p>
                    <input id="txtUser" type="text" name="nombre" disabled/>
                </div>
                <div class="input">
                <p>Disponible: </p>                    
                <input id="txtDisponible" type="text" disabled="disabled"/>
            </div>
            <div class="input">
                <p>Día solicitado : </p><input id="txtDia" type="text" name="desde" maxlength="10" disabled="disabled"/>
            </div>
        </div >
        
        <div class="box-aprobar" id="pnlAprobador">
            <div class="titulo">
                <h3>Estado de solicitud</h3>
            </div>
                <div class="input"><p>Respondido por:</p>
                    <input id="txtUser2" type="text" name="nombre" disabled/>
                </div>
                <div class="input"><p>Cargo:</p>
                    <input id="txtCargo" type="text" name="cargo" disabled/>
                </div>
				 <div class="input" id="pnlMotivoRechazo">
                    <p>Comentario:</p>
                    <input id="txtMotivo" type="text" name="nombre"/>
                </div>
                
                <div class="input">
                    <p>Fecha de respuesta:</p>
                    <input id="txtFecha" type="text" name="fecha" disabled/>
                </div>
                <div class="input" id="pnlEstadoSolicitud">
                    <p>Estado: </p><input id="txtEstado" type="text" name="Estado" disabled/>
                </div>

        </div>
        
        <input id="btnExportar"  type="button" value="Exportar pdf"/> 
        </div>
    </div>`;

    public static HTMLEdicion:string=`
    <div class="main">
        <div class="formulario" id="formulario">
                
                <div class="titulo">
                    <h3>Solicitud de día Administrativo</h3>
                </div>
                
                <div id="contenedor">
                    <div class="input">
                        <p>Realizada por:</p>
                        <input id="txtUser" type="text" name="nombre" disabled/>
                    </div>
                    <div class="input">
                        <p>Disponible: </p>                    
                        <input id="txtDisponible" type="text" disabled="disabled"/>
                    </div>
                    <div class="input">
                        <p>Fecha de día Administrativo : </p><input id="txtFecha" type="text" name="desde" maxlength="10"/>
                    </div>
                    <div class="input">
                        <p>Día Administrativo solicitado: </p>                    
                        <input id="txtNumDiaSolicitar" type="text" disabled="disabled"/>
                    </div>
                </div >
        
                <div class="box-aprobar"  id="pnlAprobador">
                    <div class="titulo">
                        <h3>Estado de solicitud</h3>
                    </div>
                    <div class="input">
                            <p>Respondido por:</p>
                            <input id="txtUser2" type="text" name="nombre" disabled/>
                        </div>
                        
                        <div class="input">
                            <p>Cargo:</p>
                            <input id="txtCargo" type="text" name="cargo" disabled/>
                        </div>


                        <div class="input" id="pnlMotivoRechazo">
                            <p>Comentario:</p>
                            <input id="txtMotivo" type="text" name="nombre"/>
                        </div>

                        <div class="input" id="pnlEstadoSolicitud">
                            <p>Estado: </p><input id="txtEstado" type="text" name="Estado" disabled/>
                        </div>


                    <div class="boton-enviar" id="pnlBotnesAprobacion">
                        <input id="btnAprobar"  type="button" value="Aprobar"/>  
                        <input id="btnRechazar"  type="button" value="Rechazar" />
                    </div>

                </div>
        
        </div>
    </div>
    `;

    public static HTMLError: string = `<div class="main">
                                        <div class="formulario" id="formulario">
                                            <div class="titulo">
                                                <h3>Solicitud de día administrativo</h3>
                                            </div>
                                            <div class="titulo">
                                              <p>Error de carga</p>
                                            </div>      
                                        </div>`;
    public static HTMLSinPermiso: string = `<div class="main">
                                        <div class="formulario" id="formulario">
                                            <div class="titulo">
                                                <h3>Solicitud de día administrativo</h3>
                                            </div>
                                            <div class="titulo">
                                              <p>No tiene autorización para ver esta información</p>
                                            </div>      
                                        </div>`;
}