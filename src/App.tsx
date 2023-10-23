// import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AppInput from './components/inputs/AppInput';
import SMButton from './components/SMButton';
import AddWalletModal, {Wallet} from './components/modals/AddWalletModal';

type Stats = {
  contracts: number;
  destChains: number;
  txsCount: number;
  volume: number;
  rank: number;
};

const StatsText = ({
  fieldName,
  value,
  error,
}: {
  fieldName: string;
  value: string | number;
  error: string | null;
}) => {
  return (
    <Text style={{fontWeight: '400', fontSize: 16, color: 'gray'}}>
      {fieldName}:{' '}
      <Text style={{fontWeight: '500', fontSize: 18, color: 'black'}}>
        {value || error}
      </Text>
    </Text>
  );
};
const Address = ({wallet}: {wallet: Wallet}) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.wallet) {
      addStats(wallet.wallet);
    }
  }, [wallet.wallet]);

  const addStats = async (adr: string) => {
    await fetch('https://nftcopilot.com/api/layer-zero-rank/check', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `address=${adr}`,
    }).then(async data => {
      const result = await data.json();
      if (!result.hasOwnProperty('error')) {
        setStats(result);
      } else {
        setError('error');
      }
    });
  };

  return (
    <View
      style={{padding: 10, backgroundColor: 'light-gray', marginBottom: 10}}>
      <Text style={{fontWeight: '700', fontSize: 18}}>{wallet.name}</Text>
      <Text style={{fontWeight: '500', fontSize: 18, color: '#4C4D56'}}>
        {wallet.wallet.slice(0, 4) + '...' + wallet.wallet.slice(25)}
      </Text>

      {stats &&
        Object.keys(stats).map((field: string, index: number) => {
          if (index < 8) {
            return (
              <StatsText
                fieldName={field}
                value={stats[field as keyof Stats]}
                error={error}
                key={field}
              />
            );
          }
        })}
    </View>
  );
};

const Footer = () => {
  return <View style={{marginBottom: 400}} />;
};

// const limit = 3;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [wallets, setWallets] = useState<Wallet[]>([]);
  // const [offset, setOffset] = useState<number>(0);
  const [value, setValue] = useState('');
  // const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  // const [dropdownValue, setDropdownValue] = useState('0');
  //
  // const [items, setItems] = useState<ItemType<any>[]>([
  //   {label: 'Layer Zero', value: '0'},
  //   {label: 'ZkSync (soon)', value: '1'},
  // ]);

  const clearAddress = async () => {
    await AsyncStorage.setItem('l0', '');
    setWallets([]);
    // setOffset(0);
  };

  const allWallets = async () => {
    const saved = await AsyncStorage.getItem('l0');
    if (saved) {
      try {
        const parsed: Wallet[] = JSON.parse(saved);
        setWallets(parsed);
      } catch (e) {
        Alert.alert('Wallet error. Clearing');
        await AsyncStorage.setItem('l0', '');
      }
    }
  };
  useLayoutEffect(() => {
    allWallets();
  }, []);

  const openModal = () => {
    setModal(true);
  };

  const handleFilter = (inputValue: string) => {
    setValue(inputValue);
    if (inputValue) {
      const filteredArray = wallets.filter(item => {
        const {name, wallet} = item;
        return (
          name.toLowerCase().includes(inputValue.toLowerCase()) ||
          wallet.toLowerCase().includes(inputValue.toLowerCase())
        );
      });
      setWallets(filteredArray);
    } else {
      allWallets();
    }
  };

  return (
    <SafeAreaView style={[]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // width: '100%',
            // justifyContent: 'space-between',
            // backgroundColor: 'black',
            zIndex: 1000,
            position: 'absolute',
            left: 20,
          }}>
          <View>
            <Text style={{fontSize: 22, textAlign: 'center', marginRight: 20}}>
              Project:{' '}
            </Text>
          </View>
          {/*<DropDownPicker*/}
          {/*  open={open}*/}
          {/*  items={items}*/}
          {/*  setItems={setItems}*/}
          {/*  value={dropdownValue}*/}
          {/*  setOpen={setOpen}*/}
          {/*  setValue={setDropdownValue}*/}
          {/*  style={{width: 150, zIndex: 1001}}*/}
          {/*/>*/}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 20,
            marginTop: 60,
          }}>
          <SMButton action={openModal} color={'blue'} text={'Add wallet'} />
          <SMButton
            action={clearAddress}
            color={'red'}
            text={'Clear wallets'}
          />
        </View>
        <View>
          <AppInput
            value={value}
            action={handleFilter}
            placeholder={'Find wallet'}
          />
        </View>
        <FlatList
          data={wallets}
          renderItem={({item}) => <Address wallet={item} />}
          style={{padding: 10}}
          ListFooterComponent={() => <Footer />}
          onEndReached={() => {}}
        />
      </View>
      <AddWalletModal
        setWallets={setWallets}
        wallets={wallets}
        isModalVisible={modal}
        setIsModalVisible={setModal}
      />
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//     backgroundColor: '#fffff',
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
