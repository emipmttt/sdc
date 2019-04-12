Vue.component("scotiabank", {
  template: `
      
      <div v-show="disponibilidad" style="display:inline-block">			
              <calculos 
                  banco="scotiabank"
                  :tasa="tasa" 
                  :valor-del-inmueble="valorDelInmueble" 
                  :factor="factor"
                  :factor-seguro-de-vida="factorSeguroDeVida" 
                  :factor-seguro-de-danos="factorSeguroDeDanos"
                  :comision-administracion="comisionAdministracion" 
                  :iva="iva"
                  :monto-de-credito="montoDeCredito"
          :monto-de-credito-por-modificacion="montoDeCreditoPorModificacion"
  
          :disponibilidad="disponibilidad"
          :enganche="enganche"
          :porcentaje-de-credito="porcentajeDeCreditoAsignado"
          
          :tipo-de-ingreso="tipoDeIngreso"
              />
              
      </div>
  
          `,
  props: ['plazo', 'tipoDePago', 'valorDelInmueble', 'productoSeleccionado', 'montoDeCreditoPorModificacion', 'tipoDeIngreso'],
  data() {
    return {

      factorSeguroDeVida: .0005,
      iva: 0,

      productos: [{
        nombre: "Comprar mi Casa",
        porcentajeMaximoDeCredito: .9,
        plazosFijos: [true, true, true],
        plazosCrecientes: [true, true, true],
        factoresFijos: [.4973450577, .231304409, .1234482],
        factoresCrecientes: [.428571428, .148571428, .03285714],
        tasaFijos: [.1130, .1150, .1160],
        tasaCrecientes: [.1050, .1050, .1050],
        factorSeguroDeDanos: .000335111,
        comisionAdministracion: 0,
      }],
    }
  },

  computed: {
    disponibilidad() {
      var disponibilidadDePlazo = false;
      var disponibilidadDeMontoDeCredito = true;
      var tipoDePlazos;
      if (this.tipoDePago == 0) tipoDePlazos = "plazosFijos";
      if (this.tipoDePago == 1) tipoDePlazos = "plazosCrecientes";
      if (this.productoAsignado[tipoDePlazos][this.plazo]) disponibilidadDePlazo = true;

      if (this.montoDeCreditoPorModificacion > this.maximoDeCredito) {
        disponibilidadDeMontoDeCredito = false
      }

      return disponibilidadDePlazo && this.valorNumericoDelInmueble && disponibilidadDeMontoDeCredito;
    },
    porcentajeDeCreditoAsignado() {
      console.log(this.montoDeCreditoPorModificacion)
      if (!isNaN(this.montoDeCreditoPorModificacion)) {
        return ((this.montoDeCreditoPorModificacion * 100) / this.valorNumericoDelInmueble) / 100;
      } else {
        return this.porcentajeMaximoDeCredito;
      }
    },
    productoAsignado() {
      return this.productos.filter(producto => {
          return producto.nombre == this.productoSeleccionado
        })[0] // devolver el primer objeto para no obtener un array 
    },
    tasa() {
      var tipoDeTasas;
      if (this.tipoDePago == 0) tipoDeTasas = "tasaFijos";
      if (this.tipoDePago == 1) tipoDeTasas = "tasaCrecientes";
      return this.productoAsignado[tipoDeTasas][this.plazo];
    },
    factor() {
      var tipoDeFactores;
      if (this.tipoDePago == 0) tipoDeFactores = "factoresFijos";
      if (this.tipoDePago == 1) tipoDeFactores = "factoresCrecientes";
      return this.productoAsignado[tipoDeFactores][this.plazo];
    },
    factorSeguroDeDanos() {
      return this.productoAsignado.factorSeguroDeDanos;
    },
    comisionAdministracion() {
      return this.productoAsignado.comisionAdministracion;
    },
    valorNumericoDelInmueble() {
      return parseFloat(this.valorDelInmueble);
    },
    porcentajeMaximoDeCredito() {
      return (this.productoAsignado.porcentajeMaximoDeCredito);
    },
    maximoDeCredito() {
      return (this.valorNumericoDelInmueble * this.productoAsignado.porcentajeMaximoDeCredito);
    },
    montoDeCredito() {
      return (this.valorNumericoDelInmueble * this.porcentajeDeCreditoAsignado)
    },
    enganche() {
      return this.valorNumericoDelInmueble - this.montoDeCredito;
    }
  }
});