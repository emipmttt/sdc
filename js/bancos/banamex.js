Vue.component("banamex", {
  template: `
      
      <div v-show="disponibilidad" style="display:inline-block">			
              <calculos 
                  banco="banamex"
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
        porcentajeMaximoDeCredito: .85,
        plazosFijos: [true, true, true],
        plazosCrecientes: [false, false, true],
        factoresFijos: [.620310784, .310673497, .171398894],
        factoresCrecientes: [0, 0, .032331604],
        tasa: [.0965, .0965, .0965],
        factorSeguroDeDanos: .00024,
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
      return this.productoAsignado.tasa[this.plazo];
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