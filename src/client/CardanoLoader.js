class CardanoLoader {
    async load() {
      if (this._wasm_cardanoinstance) return this._wasm_cardanoinstance;
      /**
       * @private
       */
      this._wasm_cardanoinstance = await import(
        '@dcspark/cardano-multiplatform-lib-browser'
      );

      return this._wasm_cardanoinstance;
    }
  
    async Cardano() {
      return this.load();
    }
  }
  
  export default new CardanoLoader();
  