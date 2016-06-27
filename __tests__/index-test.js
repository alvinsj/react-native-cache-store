'use strict';
jest.unmock('../index');

describe('CacheStore', () => {
  pit('sets and gets value', () => {
    const CacheStore = require('../index').default;
    
    expect(CacheStore.set).toBeDefined();
    expect(CacheStore.get).toBeDefined();

    CacheStore.set('key', 'value');
    return CacheStore.get('key').then((value) => {
      expect(value).toBe('value');
    });
  });

  pit('gets value when it\'s expired', () => {
    jest.mock('react-native', () => {
      const expiry = -1;
      const promise = global.Promise.resolve(expiry);
      const MockAsyncStorage = {
        getItem: jest.fn().mockReturnValue(promise),
        getAllKeys: jest.fn().mockReturnValue({then: jest.fn()}),
        multiRemove: jest.fn()
      };
      MockAsyncStorage.getItem.mockImplementation((key) => {
        return promise;
      });
      return {
        AsyncStorage: MockAsyncStorage
      }
    });

    const CacheStore = require('../index').default;
    const {AsyncStorage} = require('react-native');

    expect(CacheStore.get).toBeDefined();

    return CacheStore.get('key')
      .then((value) => {
        expect("promise").toBe("rejected");
      })
      .catch((...args)=>{
        expect(AsyncStorage.getItem).toBeCalled();
        expect(AsyncStorage.multiRemove).toBeCalled();
        console.log(args);
      });
  });
});
