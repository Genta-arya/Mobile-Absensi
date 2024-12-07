import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {useSearchStore} from '../Library/Zustand/SearchStore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimes, faSearch} from '@fortawesome/free-solid-svg-icons';

const SearchComponent = () => {
  const {searchTerm, setSearchTerm} = useSearchStore();

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <View style={styles.inputContainer}>
      <FontAwesomeIcon
        icon={faSearch}
        style={styles.searchIcon}
        size={20}
        color="#ccc"
      />
      <TextInput
        placeholder="Cari nama grup..."
        placeholderTextColor="#ccc"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.textInput}
      />

      {searchTerm.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
          <FontAwesomeIcon icon={faTimes} size={20} color="#ccc" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    paddingLeft: 25,
    color: 'black',
    padding: 0,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
  },
  clearIcon: {
    marginLeft: 10,
  },
});

export default SearchComponent;
