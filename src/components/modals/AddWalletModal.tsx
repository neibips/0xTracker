import React, {Dispatch, memo, useState} from 'react';
import {Alert, Modal, StatusBar, StyleSheet, Text, View} from 'react-native';
import AppInput from '../inputs/AppInput';
import SMButton from '../SMButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<boolean>;
  setWallets: Dispatch<Wallet[]>;
  wallets: Wallet[];
}

export type Wallet = {
  name: string;
  wallet: string;
  note: string;
};
// const compareWallets = (wallets: Wallet[]) => {
//   wallets.map(() => )
// };
const AddWalletModal: React.FC<Props> = ({
  isModalVisible,
  setIsModalVisible,
  setWallets,
  wallets,
}) => {
  const [name, setName] = useState<string>('');
  const [wallet, setWallet] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const addName = (value: string) => {
    setName(value);
  };
  const addWallet = (value: string) => {
    setWallet(value);
  };
  const addNote = (value: string) => {
    setNote(value);
  };

  const onSubmit = async () => {
    const formWallet: Wallet = {
      name,
      wallet,
      note,
    };
    const l0Data = await AsyncStorage.getItem('l0');
    const formWalletString = JSON.stringify(formWallet);
    if (l0Data) {
      try {
        const jsonData = JSON.parse(l0Data);
        const oldWallets = new Set(jsonData.map((item: Wallet) => item.wallet));
        if (!oldWallets.has(formWallet.wallet)) {
          jsonData.push(formWallet);
          await AsyncStorage.setItem('l0', `${JSON.stringify(jsonData)}`);
          setWallets([...wallets, formWallet]);
          setIsModalVisible(false);
          return Alert.alert('Success!');
        } else {
          return Alert.alert('Duplicate wallet');
        }
      } catch (e) {
        await AsyncStorage.setItem('l0', '');
        return Alert.alert('Error');
      }
    } else {
      console.log('new');
      await AsyncStorage.setItem('l0', `[${formWalletString}]`);
      setWallets([formWallet]);
      setIsModalVisible(false);
      return Alert.alert('Success!');
    }
  };
  const closeModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      onRequestClose={closeModal}>
      <StatusBar />
      <View style={styles.container}>
        <View
          style={{
            marginVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <SMButton text={'Close'} action={closeModal} color={'red'} />
          <Text style={{fontSize: 22, textAlign: 'center', marginRight: 20}}>
            Add wallet to track
          </Text>
        </View>
        <AppInput
          placeholder={'Name for wallet'}
          value={name}
          action={addName}
        />
        <AppInput
          placeholder={'Wallet address'}
          value={wallet}
          action={addWallet}
        />
        <AppInput
          placeholder={'Note for wallet'}
          value={note}
          action={addNote}
          multiline
        />
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <SMButton text={'Add'} color={'green'} action={onSubmit} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    padding: 20,
    gap: 20,
  },
});

export default memo(AddWalletModal);
