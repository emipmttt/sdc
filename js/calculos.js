Vue.component("calculos", {

  template: `
  <div v-show="false">
  
    Máximo de crédito: {{porcentajeDeCredito * 100}} %<br>
    Credito: $ {{montoDeCredito}} <br><br>
        
    Mensualidad: $ {{mensualidad.toFixed()}}<br>
      
    Tasa: {{tasa * 100}} %<br>
      
  </div>
  `,

  props: [
    'tasa',
    'valorDelInmueble',
    'factor',
    'factorSeguroDeVida',
    'factorSeguroDeDanos',
    'seguroDeDanos',
    'seguroDeDesempleo',
    'comisionAdministracion',
    'iva',
    'banco',
    'montoDeCredito',
    'disponibilidad',

    'enganche',
    'porcentajeDeCredito',

    'tipoDeIngreso'
  ],
  computed: {
    mensualidad() {

      var montoDeCreditoTotal = this.montoDeCredito;
      var seguroDeVida;

      // en caso de santander

      if (this.banco == "santander") {

        if (this.montoDeCredito < (this.valorDelInmueble * .78)) {
          var primaUnica = this.montoDeCredito * .03154;
          montoDeCreditoTotal = this.montoDeCredito + primaUnica;
          seguroDeVida = 0;
        } else {
          seguroDeVida = montoDeCreditoTotal * this.factorSeguroDeVida;
        }
      } else {
        seguroDeVida = montoDeCreditoTotal * this.factorSeguroDeVida;
      }


      var interes = (montoDeCreditoTotal * this.tasa) / 12;
      var amortizacion = interes * this.factor;
      var pagoMensual = interes + amortizacion;

      var seguroDeDanos = this.valorDelInmueble * this.factorSeguroDeDanos;

      // en caso de banregio

      var seguroDeDesempleo = 0;
      if (this.banco == "banregio") {
        seguroDeDesempleo = this.seguroDeDesempleo;
        seguroDeDanos = this.seguroDeDanos;
      }

      console.log(this.banco)
      console.log("tasa: " + this.tasa);
      console.log("monto de credito: " + montoDeCreditoTotal);
      console.log("interes: " + interes);
      console.log("amortizacion: " + amortizacion);
      console.log("pagoMensual: " + pagoMensual);
      console.log("seguroDeVida: " + seguroDeVida);
      console.log("seguroDeDanos: " + seguroDeDanos);
      console.log("seguroDeDesempleo: " + seguroDeDesempleo);
      console.log("Comisión: ", this.comisionAdministracion);
      console.log("iva: ", this.iva)
        // console.log(pagoMensual + seguroDeVida + seguroDeDanos)

      // guardar el resultado en localStorage

      var mensualidad = pagoMensual + seguroDeVida + seguroDeDanos + this.comisionAdministracion + this.iva + seguroDeDesempleo;

      var ingresos;
      if (this.tipoDeIngreso == "Asalariado") {
        ingresos = mensualidad * 2;
      } else {
        ingresos = mensualidad * 2.78;
      }

      store.commit("asignarBanco", {
        nombre: this.banco,
        valores: {
          porcentajeDeCredito: this.porcentajeDeCredito,
          montoDeCredito: this.montoDeCredito,
          mensualidad,
          ingresos,
          tasa: this.tasa,
          disponibilidad: this.disponibilidad,
          enganche: this.enganche
        }
      });

      return mensualidad;

    },
  }

})