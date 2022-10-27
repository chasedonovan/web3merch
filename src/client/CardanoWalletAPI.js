import { CoinSelectionStrategyCIP2 } from "@dcspark/cardano-multiplatform-lib-browser";
import { Buffer } from "buffer";
import CardanoLoader from './CardanoLoader';

class CardanoWalletAPI {

  async getEnabledWallets(){
      // console.log("getEnabledWallets:", window.cardano);
      let enabledWallets = [];
      const nami = await window.cardano?.nami;
      const eternl = await window.cardano?.eternl;
      const typhon = await window.cardano?.typhon;
      const gero = await window.cardano?.gero;
      const flint = await window.cardano?.flint;
      const nufi = await window.cardano?.nufi;


      if(nami){
        enabledWallets.push( { name: nami.name, icon: nami.icon, provider: nami } )
      }

      if(eternl){
        enabledWallets.push( { name: eternl.name, icon: eternl.icon, provider: eternl } )
      }

      if(typhon){
        enabledWallets.push( { name: typhon.name, icon: typhon.icon, provider: typhon } )
      }

      if(gero){
        enabledWallets.push( { name: gero.name, icon: gero.icon, provider: gero } )
      }

      if(flint){
        enabledWallets.push( { name: flint.name, icon: flint.icon, provider: flint } )
      }

      if(nufi){
        enabledWallets.push( { name: nufi.name, icon: nufi.icon, provider: nufi } )
      }

      if(!enabledWallets || enabledWallets.length === 0)
        return undefined;

      return enabledWallets;
  }

  async enableWallet(providerName){
    if(providerName === "Nami"){
      return await this.private_namiEnable();
    }
    if(providerName === "eternl"){
      return await this.private_eternlEnable();
    }
    if(providerName === "gero"){
      return await this.private_geroEnable();
    }
    if(providerName === "Typhon Wallet"){
      return await this.private_typhonEnable();
    }
    if(providerName === "Flint Wallet"){
      return await this.private_flintEnable();
    }
    if(providerName === "nufi"){
      return await this.private_nufiEnable();
    }
  }

  //added get getStakeAdress if usedAddresses is undefined
  async getAddress(walletProviderApi){
    const cardano = await CardanoLoader.Cardano();
    const address = (await walletProviderApi.getUsedAddresses())[0];
    // console.log("Address: " + address);
    if (address && address !== undefined) {
    return cardano.Address.from_bytes(
      Buffer.from( address, "hex")
    ).to_bech32() }

//if undefined it runs this
    if (address === undefined) {
      console.log("Address is undefined, using stake");
//try catch implemented but commented out (awaiting review)
    // try {
      const raw = await walletProviderApi.getRewardAddresses();
      const rawFirst = raw[0];
      const rewardAddress = cardano.Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
      // console.log("getRewardAddresses", rewardAddress);
      return rewardAddress;
    // } catch (err) {
    //   console.log(err)
    // }  
    }
  }

  async getBalance(walletProviderApi){
    const cardano = await CardanoLoader.Cardano();
    const balanceResponse = (await walletProviderApi.getBalance());
    const balance = cardano.Value.from_bytes(Buffer.from(balanceResponse, 'hex'));
    const lovelaces = balance.coin().to_str();
    if (lovelaces) {
      return lovelaces/1000000;
    }
    return 0;
  }

  async private_eternlEnable(){
    const provider = await window.cardano?.eternl;
    console.log("Enable " + provider.name);
    var providerapi = await this.private_enableWallet(provider);
    return providerapi;
  }

  async private_namiEnable(){
    const provider = await window.cardano?.nami;
    console.log("Enable " + provider.name);
    var providerapi = await this.private_enableWallet(provider);
    return providerapi;
  }

  async private_typhonEnable(){
    const provider = await window.cardano?.typhon;
    console.log("Enable " + provider.name);
    var providerapi = await this.private_enableWallet(provider);
    return providerapi;
  }

  async private_flintEnable(){
    const provider = await window.cardano?.flint;
    console.log("Enable " + provider.name);
    var providerapi = await this.private_enableWallet(provider);
    return providerapi;
  }

  async private_geroEnable(){
    const provider = await window.cardano?.gero;
    console.log("Enable " + provider.name);
    var providerapi = await this.private_enableWallet(provider);
    return providerapi;
  }

  async private_nufiEnable(){
    const provider = await window.cardano?.nufi;
    console.log("Enable " + provider.name);
    var providerapi = await this.private_enableWallet(provider);
    return providerapi;
  }

  async signDataNami(providerapi){
    //https://cardano.stackexchange.com/questions/4793/how-to-establish-trust-between-a-users-wallet-and-the-backend-of-a-website/4814#4814
    console.log("Sign data Nami");

      try{
        const hexMessage = Buffer.from("Login to uniscroll.io").toString('hex');
        // console.log("hexMessage:");
        // console.log(hexMessage);
        const raw = await providerapi.getRewardAddresses();
        const rawFirst = raw[0];
        // console.log("RewardAddress");
        // console.log(rawFirst);
        const signedData = await providerapi.signData(rawFirst, hexMessage);
        console.log('signedData', signedData);
        if(signedData){
          return signedData;
        }
      }catch(e){
        console.log(e);
      }

  }

  async signData(providerapi){
    //https://cardano.stackexchange.com/questions/4793/how-to-establish-trust-between-a-users-wallet-and-the-backend-of-a-website/4814#4814
    console.log("Sign data");
    if(providerapi){
      try{
      const hexMessage = Buffer.from("Login to uniscroll.io").toString('hex');
      // console.log("hexMessage:");
      console.log(hexMessage);
      const rewardAddress = await this.getRewardAddresses(providerapi);
      // console.log("RewardAddress");
      // console.log(rewardAddress);
      const signedData = await providerapi.signData(rewardAddress, hexMessage);
      console.log('signedData', signedData);
      if(signedData){
        return signedData;
      }
      
      }catch(e){
        console.log(e);
      }
    }
  }

  async private_enableWallet(provider){
    try{
      const providerapi = await provider.enable();
      return providerapi;
    }catch(e){
      throw "Could not enable " + provider.name + ". Allow access to the wallet and try again. " + e;
    }
  }

  async getRewardAddresses (walletProviderApi) {

    try {
      const cardano = await CardanoLoader.Cardano();
      const raw = await walletProviderApi.getRewardAddresses();
      const rawFirst = raw[0];
      const rewardAddressHex = cardano.Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
      return rewardAddressHex;
    } catch (err) {
      console.log(err)
    }
  }

  async pay(walletProviderApi, protocolParameters, outputAddress, paymentAmountLovelace){
    try{
      const cardano = await CardanoLoader.Cardano();
      console.log('pay', walletProviderApi);
      const paymentAddressRaw = await this.private_getPaymentAddressRaw(walletProviderApi);
      console.log('paymentAddressRaw', paymentAddressRaw);
      console.log('outputAddress', outputAddress);
      console.log('paymentAmountLovelace', paymentAmountLovelace);

      if(!protocolParameters || !protocolParameters.min_fee_a){
        return {
          success: false,
          message: "Protocol parameters could not be loaded. Reload the page and try again.",
          transactionId: ""
        };
      }
      const utxos = await this.private_getUTXOs(walletProviderApi);
      console.log(protocolParameters);
      const transaction = await this.private_createpaymentTransaction(
        protocolParameters, paymentAddressRaw, utxos, cardano, outputAddress, paymentAmountLovelace);
      console.log(transaction);
      const signedTransaction = await this.private_signTransaction(walletProviderApi,
        transaction,
        cardano
      );
      console.log("Transaction signed:", signedTransaction);

      return await this.private_submitTransaction(walletProviderApi,
        signedTransaction
      );
    }
    catch(e){
      console.log(e);
      let message = "";
      if(e && e.length > 0){
        message = e;
      }
      else if(e && e.message){
        message = e.message;
      }
      throw {
        success: false,
        transactionId: "",
        message: "Transaction failed. " + message
      };
    }
  }

  async private_submitTransaction( walletProviderApi, signedTransaction )
  {
    // returns the transaction hash
    const transId = await walletProviderApi.submitTx(
      Buffer.from( signedTransaction.to_bytes(), "hex").toString("hex"));

    return {
      success: true,
      message: "Transaction submitted successfully! https://cardanoscan.io/transaction/" + transId,
      transactionId: transId
    };
  };

  async private_getUTXOs(walletProviderApi){
    const cardano = await CardanoLoader.Cardano();
    console.log(cardano);
    let utxos = await walletProviderApi.getUtxos();

    utxos = utxos.map((utxo) =>
      cardano.TransactionUnspentOutput.from_bytes(Buffer.from(utxo, "hex"))
    );

    const UTxOs = cardano.TransactionUnspentOutputs.new()
    utxos.forEach( u => UTxOs.add(u) );

    return UTxOs;
  }

  async private_getRewardAddressRaw ( walletProviderApi )
  {
      let rawAddress = await walletProviderApi.getRewardAddresses();

      if( Array.isArray(rawAddress) )
      {
          rawAddress = rawAddress[0];
      }
      else if( typeof rawAddress === "object" )
      {
          // typhon
          rawAddress = rawAddress.data;
      }
      return rawAddress;
  }

  async private_getPaymentAddressRaw ( walletProviderApi )
  {
      let rawAddress = await walletProviderApi.getUsedAddresses();

      if( Array.isArray(rawAddress) )
      {
          rawAddress = rawAddress[0];
      }
      else if( typeof rawAddress === "object" )
      {
          // typhon
          rawAddress = rawAddress.data;
      }

      return rawAddress;
  }

  async private_createpaymentTransaction(protocolParameters, inputAddressRaw, utxos, cardano, outputAddressBech32, paymentAmountLovelace){
    const inputAddress = cardano.Address.from_bytes(Buffer.from(inputAddressRaw, "hex"));
    const outputAddress = cardano.Address.from_bech32(outputAddressBech32)
    console.log("lovelace", paymentAmountLovelace);
    console.log("1. Configuring transaction");
    let txBuilderConfig = cardano.TransactionBuilderConfigBuilder.new();

    txBuilderConfig = txBuilderConfig.coins_per_utxo_word(
      cardano.BigNum.from_str(protocolParameters.coins_per_utxo_word)
    )
    .fee_algo(
      cardano.LinearFee.new(
        cardano.BigNum.from_str(protocolParameters.min_fee_a.toString()),
        cardano.BigNum.from_str(protocolParameters.min_fee_b.toString())
      )
    )
    .key_deposit(cardano.BigNum.from_str(protocolParameters.key_deposit))
    .pool_deposit(cardano.BigNum.from_str(protocolParameters.pool_deposit))
    .max_tx_size(parseInt(protocolParameters.max_tx_size))
    .max_value_size(parseInt(protocolParameters.max_val_size))
    .prefer_pure_change(true)
    .build();

    const txBuilder = cardano.TransactionBuilder.new(txBuilderConfig);

    console.log("2. Adding inputs to transaction");
    txBuilder.add_inputs_from(utxos, cardano.CoinSelectionStrategyCIP2.LargestFirst);

    console.log("3. Adding outputs to transaction");
    txBuilder.add_output(cardano.TransactionOutput.new(
      outputAddress,
      cardano.Value.new(cardano.BigNum.from_str(
        //paymentAmountLovelace.toString()
        '1131000'
        ))    
      ));

    console.log("4. Add change");
    txBuilder.add_change_if_needed(outputAddress);
    console.log("5. Set witnesses");
    const transaction = cardano.Transaction.new(
      txBuilder.build(),
      cardano.TransactionWitnessSet.new()
    );

    return transaction;
  }

  async private_signTransaction( walletProviderApi, transaction, cardano)
  {
      // console.log(cardano);
      let sign;
      try{
        sign = await walletProviderApi.signTx(
                      Buffer.from(transaction.to_bytes(), "hex").toString("hex")
                  );
      }
      catch(e){
        let message = "";
          if(e && e.message){
            message = e.message;
          }
        throw "Signature rejected by user. " + message;
      }
      // the transaction is signed ( by the witnesess )
      return await cardano.Transaction.new(
        transaction.body(),
          // get witnesses object
          cardano.TransactionWitnessSet.from_bytes(
              Buffer.from(
                  // gets witnesses
                sign,
                  "hex"
              )
          )
      );
  };
}

export default new CardanoWalletAPI();
