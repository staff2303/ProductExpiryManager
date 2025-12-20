import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { InventoryRow } from '../db/sqlite';

type Props = {
  visible: boolean;
  inventory: InventoryRow;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function InventoryCheckModal({
  visible,
  inventory,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>제품 정보 확인</Text>

          <View style={styles.productInfoContainer}>
            <Image
              source={{ uri: inventory.imageUri }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.textInfo}>
              <Text style={styles.productName}>{inventory.name}</Text>
              <Text style={styles.expiryLabel}>등록된 유통기한</Text>
              <Text style={styles.expiryDate}>{inventory.expiryDate}</Text>
              <Text style={styles.createdAt}>
                (등록일: {inventory.createdAt.split('T')[0]})
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonEdit]}
              onPress={onEdit}
            >
              <Text style={styles.textStyle}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonDelete]}
              onPress={onDelete}
            >
              <Text style={styles.textStyle}>삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  productInfoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#333',
  },
  textInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  expiryLabel: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  expiryDate: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700', // Gold color for emphasis
  },
  createdAt: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonEdit: {
    backgroundColor: '#007AFF', // Blue
  },
  buttonDelete: {
    backgroundColor: '#FF3B30', // Red
  },
  buttonClose: {
    backgroundColor: '#555', // Gray
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
