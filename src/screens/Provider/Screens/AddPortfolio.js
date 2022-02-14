import {
  Actionsheet,
  Button,
  Checkbox,
  FormControl,
  HStack,
  Icon,
  Input,
  ScrollView,
  Text,
  TextArea,

  useDisclose
} from 'native-base';
import React, { useState, useEffect } from 'react';
import { cleangigApi, sotApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { askForCamera } from "../../../helpers";
import ImageCarousel from "../../../components/ImageCarousel";
import mime from "mime";

const AddPortFolio = ({ navigation, route }) => {
  const user = useSelector(state => state.user.data);
  const screenTitle = 'Add Portfolio';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [offeredServices, setOfferedServices] = useState([]);
  const [pictures, setPictures] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data } = await sotApi.get(`services/get_all?provider=${user.id}`);
    setOfferedServices(data.services);
  }

  const save = async () => {
    let noPictures = true;
    if (pictures.length > 0) noPictures = false;
    const pics = noPictures ? null : await uploadPictures();
    const data = new FormData();
    data.append('title', title);
    data.append('content', description);
    data.append('picture_url', noPictures ? '' : JSON.stringify(pics));
    data.append('services', JSON.stringify(selectedServices));
    console.log(data)
    const { data: portfolio } = await cleangigApi.post(`providers/${user.id}/portfolio`, data);
    if (portfolio) { route.params.refreshPage(true);  navigation.goBack() }
  }

  async function _processImageAsync(uri) {
    return await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
  }

  const openCamera = async () => {
    onClose();
    const { cameraStatus } = await ImagePicker.getCameraPermissionsAsync();
    // console.log("cameraStatus", cameraStatus);
    if (cameraStatus !== "granted") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        return;
      }
    }

    let photo = await askForCamera();
    if (!photo.cancelled) {
      const pPhoto = await _processImageAsync(photo.uri);
      const nPictures = [...pictures]
      nPictures.push({
        uri: pPhoto.uri,
        name: `${new Date().getTime()}.JPG`,
        type: mime.getType(pPhoto.uri),
      });
      setPictures(nPictures)
      // console.log("pictures", nPictures);
    }
  }

  async function uploadPictures() {
    const request = new FormData();
    pictures.forEach((pic) => request.append("files[]", pic));
    const { data } = await cleangigApi.post("files", request);

    return data.files;
  }

  const choosePictures = () => {
    onClose();
    navigation.navigate("ImageBrowser", { pictures, setPictures });
  }

  const removePicHandler = (index) => {
    // console.log(index);
    let tempPictures = [...pictures];
    tempPictures.splice(index, 1);
    setPictures(tempPictures);
  };

  const validate = () => {
    console.log(selectedServices)
    console.log(user)
    let valid = true;
    if (title === '') {
      valid = false;
      setError('Title is require');
    } else if (selectedServices.length == 0) {
      valid = false;
      setError('Service is require');
    }

    if (valid) {
      setError('');
      save()
    }
  }

  return (
    <>
      <AppBar backButton navigation={navigation} screenTitle={screenTitle} customOptions={[
        { action: validate, icon: 'save' }
      ]} />

      <ScrollView my="3">
        {error !== '' && <Text px="4" fontSize="md" fontWeight="medium" mb="2" color="red.400" >{error}</Text>}
        <FormControl px="4" mb="3">
          <FormControl.Label>Title</FormControl.Label>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            borderRadius="8"
            _focus={{
              borderColor: "#ff7e1a"
            }}
            borderColor="#ff7e1a"
            borderWidth={1}
          />
        </FormControl>
        <FormControl px="4" mb="3">
          <FormControl.Label>Description</FormControl.Label>
          <TextArea
            value={description}
            borderRadius="8"
            _focus={{
              borderColor: "#ff7e1a"
            }}
            borderColor="#ff7e1a"
            borderWidth={1}
            onChangeText={setDescription}
            h="150"
          />
        </FormControl>
        <FormControl px="4" mb="3">
          <FormControl.Label>Services</FormControl.Label>
          <Checkbox.Group onChange={setSelectedServices} value={selectedServices} accessibilityLabel="choose values">
            {
              offeredServices.map(service => (
                <Checkbox colorScheme="orange" key={service.id} value={service.id}>{service.name}</Checkbox>
              ))
            }
          </Checkbox.Group>
        </FormControl>

        <HStack px="4" justifyContent="space-between">
          <Text fontWeight="medium">Lägg till bilder</Text>
          <Icon as={FontAwesome} name="plus" color="#ff7e1a" size="6" onPress={onOpen}></Icon>
        </HStack>

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Actionsheet.Item onPress={openCamera}>
              Öppna kamera
            </Actionsheet.Item>
            <Actionsheet.Item onPress={choosePictures}>
              Välj från biblioteket
            </Actionsheet.Item>
            <Actionsheet.Item onPress={onClose}>Avbryt</Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>

        {pictures.length > 0 && (
          <>
            <HStack minH={200} ml={5} my={10}>
              <ImageCarousel
                images={pictures.map((pic) => pic.uri)}
                isNewJob={true}
                removePic={removePicHandler}
              />
            </HStack>
            <Button variant="subtle" onPress={() => setPictures([])}>
              Ta bort bilder
            </Button>
          </>
        )}
      </ScrollView>
    </>
  );
}

export default AddPortFolio;