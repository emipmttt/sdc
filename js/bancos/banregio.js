Vue.component("banregio", {
  template: `
      
      <div v-show="disponibilidad" style="display:inline-block">			
              <calculos 
                    banco="banregio"
                    :tasa="tasa" 
                    :valor-del-inmueble="valorDelInmueble" 
                    :factor="factor"
                    :factor-seguro-de-vida="factorSeguroDeVida" 
                    :seguro-de-danos="seguroDeDanos"
                    :comision-administracion="comisionAdministracion" 
                    :iva="iva"
                    :monto-de-credito="montoDeCredito"
                    :monto-de-credito-por-modificacion="montoDeCreditoPorModificacion"
            
                    :disponibilidad="disponibilidad"
                    :enganche="enganche"
                    :porcentaje-de-credito="porcentajeDeCreditoAsignado"

                    :seguro-de-desempleo="seguroDeDesempleo"
                    
                    :tipo-de-ingreso="tipoDeIngreso"
              />
              
      </div>
  
          `,
  props: ['plazo', 'tipoDePago', 'valorDelInmueble', 'productoSeleccionado', 'montoDeCreditoPorModificacion', 'tipoDeIngreso'],
  data() {
    return {

      factorSeguroDeVida: .00053,
      iva: 0,

      productos: [{
        nombre: "Comprar mi Casa",
        porcentajeMaximoDeCredito: .9,
        plazosFijos: [true, true, true],
        plazosCrecientes: [false, false, true],
        seguroAsalariado: .0003,
        datosVariables: {
          asalariado: {
            fijos: {
              mayor: {
                factor: [.474339878, .199229681, .088290777],
                tasa: [.11, .1150, .12],
              },
              menor: {
                factor: [.531857836, .228884299, .1043032],
                tasa: [.1025, .1075, .1125],
              },
            },
            crecientes: {
              mayor: {
                factor: [0, 0, .018818555],
                tasa: [0, 0, .12],
              },
              menor: {
                factor: [0, 0, .0331296],
                tasa: [0, 0, .1125],
              },
            },
          },
          otros: {
            fijos: {
              mayor: {
                factor: [.484450424, .206189449, .092741888],
                tasa: [.11, .1150, .12],
              },
              menor: {
                factor: [.543088698, .236784012, .109492114],
                tasa: [1025, .1075, .1125],
              },
            },
            crecientes: {
              mayor: {
                factor: [0, 0, .018818555],
                tasa: [0, 0, .12],
              },
              menor: {
                factor: [0, 0, .0331296],
                tasa: [0, 0, .1125],
              },
            },
          },
        },
        comisionAdministracion: 250,
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
        disponibilidadDeMontoDeCredito = false;
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
    seguroDeDesempleo() {
      if (this.tipoDeIngreso == "Asalariado") {
        return this.montoDeCredito * this.productoAsignado.seguroAsalariado
      } else {
        return 0
      }
    },
    tasa() {
      var tipoDeFactores;
      var tipoDeIngresos;
      var porcentaje;

      if (this.tipoDeIngreso == "Asalariado") tipoDeIngresos = "asalariado"
      if (this.tipoDeIngreso != "Asalariado") tipoDeIngresos = "otros"

      if (this.tipoDePago == 0) tipoDeFactores = "fijos";
      if (this.tipoDePago == 1) tipoDeFactores = "crecientes";

      if (this.montoDeCredito > (this.valorNumericoDelInmueble * .7)) porcentaje = "mayor"
      if (this.montoDeCredito <= (this.valorNumericoDelInmueble * .7)) porcentaje = "menor"

      return this.productoAsignado.datosVariables[tipoDeIngresos][tipoDeFactores][porcentaje].tasa[this.plazo];

    },
    factor() {
      var tipoDeFactores;
      var tipoDeIngresos;
      var porcentaje;

      if (this.tipoDeIngreso == "Asalariado") tipoDeIngresos = "asalariado"
      if (this.tipoDeIngreso != "Asalariado") tipoDeIngresos = "otros"

      if (this.tipoDePago == 0) tipoDeFactores = "fijos";
      if (this.tipoDePago == 1) tipoDeFactores = "crecientes";

      if (this.montoDeCredito > (this.valorNumericoDelInmueble * .7)) porcentaje = "mayor"
      if (this.montoDeCredito <= (this.valorNumericoDelInmueble * .7)) porcentaje = "menor"

      return this.productoAsignado.datosVariables[tipoDeIngresos][tipoDeFactores][porcentaje].factor[this.plazo];

    },
    seguroDeDanos() {
      var valorCasa = this.valorNumericoDelInmueble * .812;
      return valorCasa * .000074364;
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