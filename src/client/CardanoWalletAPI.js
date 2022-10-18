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

  async delegate(walletProviderApi, protocolParameters, delegateInfo){
    try{
      //check current delegation (if already delegated to UNI1: return)
      if(delegateInfo && delegateInfo.poolTicker){
        if(delegateInfo.poolTicker === "UNI1"){
          return {
            success: true,
            message: "You are already delegated to Unipool (UNI1).",
            transactionId: ""
          };  
        }
      }

      const cardano = await CardanoLoader.Cardano();
      console.log('delegate', walletProviderApi);
      const poolId = "pool1ps2yl6axlh5uzzst99xzkk7x0fhlmr7x033j7cmmm82x2a9n8lj"; //UNI1
      const rewardAddressRaw = await this.private_getRewardAddressRaw(walletProviderApi);
      const paymentAddressRaw = await this.private_getPaymentAddressRaw(walletProviderApi);
      
      if(!protocolParameters || !protocolParameters.min_fee_a){
        return {
          success: false,
          message: "Protocol parameters could not be loaded. Reload the page and try again.",
          transactionId: ""
        };
      }
      const utxos = await this.private_getUTXOs(walletProviderApi);
      console.log(protocolParameters);
      const delegationTransaction = await this.private_createDelegationTransaction(poolId, protocolParameters, rewardAddressRaw, paymentAddressRaw, utxos, cardano);
      console.log(delegationTransaction);
      const signedTransaction = await this.private_signTransaction(walletProviderApi,
        delegationTransaction,
        cardano
      );
      console.log("Delegation transaction signed:", signedTransaction);

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
        message: "Delegation failed. " + message
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
      message: "Delegation transaction submitted successfully! https://cardanoscan.io/transaction/" + transId,
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

  async private_createDelegationTransaction(poolId, protocolParameters, rewardAddressRaw, paymentAddressRaw, utxos, cardano){
    const paymentAddress = cardano.Address.from_bytes(Buffer.from(paymentAddressRaw, "hex"));
    const rewardAddress = cardano.Address.from_bytes(Buffer.from(rewardAddressRaw, "hex"));
    // console.log(paymentAddress);
    // console.log(rewardAddress);
    // console.log(cardano);
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

    // console.log("1.1. Configuring ExUnitPrices");

    // const exUnitPrices = cardano.ExUnitPrices.new(
    //     cardano.UnitInterval.new(cardano.BigNum.from_str("577"),cardano.BigNum.from_str("10000")),
    //     cardano.UnitInterval.new(cardano.BigNum.from_str("721"),cardano.BigNum.from_str("10000000")));

    // txBuilderConfig = txBuilderConfig.ex_unit_prices(exUnitPrices);
    // console.log("1.2. Configuring collateral");
    // txBuilderConfig = txBuilderConfig.collateral_percentage(0);
    // txBuilderConfig = txBuilderConfig.max_collateral_inputs(1);

    // console.log(txBuilderConfig);
    const txBuilder = cardano.TransactionBuilder.new(txBuilderConfig);
    // console.log(txBuilder);

    console.log("2. Adding inputs to transaction");
    //txBuilder.add_utxo(utxos);
    txBuilder.add_inputs_from(utxos, cardano.CoinSelectionStrategyCIP2.LargestFirst);

    console.log("3. Adding certificates");
    const stakeCredential = cardano.RewardAddress.from_address(
      rewardAddress
    ).payment_cred();
    const certificates = cardano.Certificates.new();

    const delegation = {active:true}; //If you have an active delegation, you can reduce 2 ADA cost
    if (!delegation.active)
      certificates.add(
        cardano.Certificate.new_stake_registration(
          cardano.StakeRegistration.new(stakeCredential)
        )
      );

    certificates.add(
      cardano.Certificate.new_stake_delegation(
        cardano.StakeDelegation.new(
          stakeCredential,
          cardano.Ed25519KeyHash.from_bech32(poolId)
        )
      )
    );
    txBuilder.set_certs(certificates);
    console.log("4. Add change");
    txBuilder.add_change_if_needed(paymentAddress);
    console.log("5. Set witnesses");
    const transaction = cardano.Transaction.new(
      txBuilder.build(),
      cardano.TransactionWitnessSet.new()
    );
    // console.log("11");
    // const size = transaction.to_bytes().length * 2;
    // console.log("12");
    // if (size > protocolParameters.max_tx_size) throw "ERROR.txTooBig";
    // console.log("13");
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
