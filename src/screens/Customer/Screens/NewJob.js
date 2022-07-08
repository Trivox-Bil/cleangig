import React, { useRef, useState } from "react";
import AppBar from "../../../components/AppBar";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
  Actionsheet,
  Button,
  Center,
  useDisclose,
  FormControl,
  Heading,
  HStack,
  Input,
  Pressable,
  Select,
  TextArea,
  Text,
  VStack,
  Checkbox,
  IconButton,
  Icon,
  Radio,
  AlertDialog, Popover, Box
} from "native-base";
import mime from "mime";
import { askForCamera } from "../../../helpers";
import { useSelector } from "react-redux";
import counties, { county } from "../../../data/counties";
import addDays from "date-fns/addDays";
import DatePicker from "../../../components/DatePicker";
import { cleangigApi } from "../../../network";
import { CheckBox } from "react-native-elements";
import SafeScrollView from "../../../components/SafeScrollView";
import ImageCarousel from "../../../components/ImageCarousel";
import { Image, Keyboard, View, TouchableOpacity } from "react-native";
import { ListItem } from 'react-native-elements';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { position } from "styled-system";

export default function ({ route, navigation }) {

  const [infoOpen, setInfoOpen] = React.useState(false);                          //for Info Icon Alert
  const infoClose = () => setInfoOpen(false);                                     //for Info Icon Alert
  const cancelRef = React.useRef(null);                                       //for Info Icon Alert

  const service = route.params.service;
  const user = useSelector((state) => state.user.data);
  const [title, setTitle] = useState(route.params.title || "");
  const [description, setDescription] = useState(
    route.params.description || ""
  );
  const [pictures, setPictures] = useState(route.params.photos || []);
  const [editAddress, setEditAddress] = useState(false);
  const [street, setStreet] = useState(route.params.street || user.street);
  const [city, setCity] = useState(route.params.city || user.city);
  const [county, setCounty] = useState(
    route.params.county || counties.find((c) => c.code === user.county)
  );
  // const [deadlineFrom, setDeadlineFrom] = useState(
  //   route.params.deadlineFrom || addDays(new Date(), 7)
  // );
  const [deadlineFrom, setDeadlineFrom] = useState(
    route.params.deadlineFrom || addDays(new Date(), 1)
  );
  const [deadlineTo, setDeadlineTo] = useState(
    route.params.deadlineTo || addDays(new Date(), 8)
  );
  const [visibility, setVisibility] = useState(
    route.params.visibility || "public"
  );
  const [loading, setLoading] = useState(false);
  // const [noPictures, setNoPictures] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0)
  const [bookType, setBookType] = useState('1')
  const [dangerousMaterial, setDangerousMaterial] = useState(false)
  const [sizes, setSizes] = useState([])
  const titleInput = useRef(null);
  const descInput = useRef(null);
  function choosePictures() {
    onClose();
    navigation.navigate("ImageBrowser", {
      title,
      description,
      deadlineFrom,
      deadlineTo,
      service,
      editAddress,
      street,
      city,
      county,
      visibility,
      pictures,
    });
  }

  async function openCamera() {
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

  async function _processImageAsync(uri) {
    return await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
  }

  async function create() {
    try {
      let noPictures = true;
      if (pictures.length > 0) noPictures = false;
      setLoading(true);
      const pics = noPictures ? null : await uploadPictures();
      const request = {
        customer: user.id,
        service: service.id,
        county: county.code,
        street,
        city,
        title,
        description,
        deadline_begin: deadlineFrom,
        deadline_end: deadlineTo,
        visibility,
        pictures: noPictures ? null : JSON.stringify(pics),
        posted_for: Object.keys(selectedProviders).join(),
        book_type: bookType,
        size: sizes.join(),
        dangerous_material: dangerousMaterial ? 1 : 0
      };
      const resp = await fetch("https://cleangig.se/api/jobs", {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (data.id) {
        navigation.navigate("Customer", {
          screen: "Job",
          params: { screen: "Job", params: { id: data.id, isNew: true } },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const validate = () => {
    let valid = true
    // if (title === '' && service.name !== "Avfall") {
    //   setError('Rubrik krävs');
    //   titleInput.current.focus();
    //   valid = false
    // } else 
    if (sizes.length === 0 && service.name === "Avfall") {
      setError('Storlek krävs');
      valid = false
    } else if (description === '') {
      descInput.current.focus();
      setError('Beskrivande text krävs');
      valid = false
    } else if (visibility === 'private' && selectedProviders.length === 0) {

      setError('Välj ett företag');
      valid = false
    }

    if (valid) {
      setError('')
      if (step == 0) {
        setStep(1)
      } else {
        create()
      }
    }
  }

  async function uploadPictures() {
    const request = new FormData();
    pictures.forEach((pic) => request.append("files[]", pic));
    const { data } = await cleangigApi.post("files", request);

    return data.files;
  }

  const deadLineFormHandler = (value) => {
    setDeadlineFrom(value);
    if (value > deadlineTo) {
      setDeadlineTo(value);
    }
  };

  const removePicHandler = (index) => {
    // console.log(index);
    let tempPictures = [...pictures];
    tempPictures.splice(index, 1);
    setPictures(tempPictures);
  };

  const chooseCompany = () => {
    navigation.navigate("BrowseProvider", { selectedProviders, setSelectedProviders, service })
  };

  const removeProvider = (key) => {
    let temp = { ...selectedProviders };
    delete temp[key];
    setSelectedProviders(temp)
  }

  const backHandler = () => {

    if (step === 0) {
      navigation.goBack()
    } else {
      setStep(0);
    }
  }

  return (
    <>
      <AppBar
        backButton
        backButtonHandler={backHandler}
        navigation={navigation}
        screenTitle="Skapa nytt jobb"
      // customOptions={[
      //   step === 0 && { action: validate, icon: 'check' }
      // ]}
      />

      <SafeScrollView flex={1}>
        <VStack space={2} m={4}>
          <Heading>{service.name}</Heading>

          {/* <Center bg="accent.400" p={4} rounded="lg" my={4}>
            <Text color="dark.200">
              Enbart Swish används som betalningsalternativ
            </Text>
          </Center> */}

          {error !== '' && <Text color="danger.700" fontWeight={500}>{error}</Text>}

          {step === 0 ? (
            <>

              {service.name === "Avfall"
                && <>
                  <FormControl isRequired mb="3">
                    <FormControl.Label>Vad vill du boka?</FormControl.Label>
                    <Radio.Group name="type" value={bookType} onChange={nextValue => {
                      setBookType(nextValue);
                    }}>
                      <Radio value="1" my={1} >
                        Container
                      </Radio>
                      <Radio value="2" my={1}>
                        Byggsäckar
                      </Radio>
                      <Radio value="3" my={1} >
                        Upphämtning
                      </Radio>
                    </Radio.Group>
                  </FormControl>
                  <FormControl isRequired mb="3">
                    <FormControl.Label>Storlek</FormControl.Label>
                    {
                      bookType === "1"
                        ? <Checkbox.Group onChange={setSizes} value={sizes}>
                          <Checkbox value="10">10</Checkbox>
                          <Checkbox value="20">20</Checkbox>
                          <Checkbox value="30">30</Checkbox>
                        </Checkbox.Group>
                        : <Checkbox.Group onChange={setSizes} value={sizes}>
                          <Checkbox value="1">1</Checkbox>
                          <Checkbox value="2">2</Checkbox>
                        </Checkbox.Group>
                    }
                  </FormControl>
                  <FormControl mb="3" style={{ flexDirection: 'row' }}>
                    <Checkbox value={dangerousMaterial} onChange={() => setDangerousMaterial(!dangerousMaterial)}>Farligt avfall?</Checkbox>

                    <Popover placement='left' trigger={triggerProps => {
                      return <TouchableOpacity {...triggerProps}>
                        <Icon as={FontAwesome} name='info-circle' colorScheme="danger" size={4} mt={1} ml={2}> </Icon>
                      </TouchableOpacity>;
                    }}>
                      <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                        <Popover.Arrow />
                        <Popover.Body>
                          Elektronik, kemikalier, tryckimpregnerat trä mm.
                        </Popover.Body>
                      </Popover.Content>
                    </Popover>
                  </FormControl>
                </>
              }

              <FormControl isRequired mb="5">
                <FormControl.Label>Beskrivande text</FormControl.Label>
                <TextArea
                  ref={descInput}
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

              <HStack justifyContent="space-between">
                <Text fontWeight="medium">Lägg till bilder</Text>
                <Icon as={FontAwesome} name="plus" color="#ff7e1a" size="6" onPress={() => { Keyboard.dismiss(); onOpen() }}></Icon>
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

              <Button
                _text={{ color: "light.200" }}
                my={5}
                rounded="md"
                p="3"
                mt={5}
                onPress={validate}
                isLoading={loading}
                isLoadingText="Läser in..."
              >
                Nästa
              </Button>
            </>
          ) : (
            <>
              {editAddress ? (
                <>
                  <FormControl mb="3">
                    <FormControl.Label>Län</FormControl.Label>
                    <Select
                      value={county.name}
                      onValueChange={setCounty}
                      selectedValue={county}
                      borderRadius="8"
                      _focus={{
                        borderColor: "#ff7e1a"
                      }}
                      borderColor="#ff7e1a"
                      borderWidth={1}
                    >
                      {counties.map((county) => {
                        return (
                          <Select.Item
                            label={county.name}
                            value={county}
                            key={county.code}
                          />
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl isRequired mb="3">
                    <FormControl.Label>Stad</FormControl.Label>
                    <Select
                      selectedValue={city}
                      borderRadius="8"
                      _focus={{
                        borderColor: "#ff7e1a"
                      }}
                      borderColor="#ff7e1a"
                      borderWidth={1}
                      onValueChange={setCity}>
                      {county.cities.sort().map((city, i) => {
                        return <Select.Item label={city} value={city} key={i} />;
                      })}
                    </Select>
                  </FormControl>

                  <FormControl isRequired mb="3">
                    <FormControl.Label>Gatuadress</FormControl.Label>
                    <Input
                      value={street}
                      onChange={setStreet}
                      autoComplete="street-address"
                      borderRadius="8"
                      _focus={{
                        borderColor: "#ff7e1a"
                      }}
                      borderColor="#ff7e1a"
                      borderWidth={1}
                    />
                  </FormControl>
                </>
              ) : (
                <VStack mb="3">
                  <Text fontWeight="medium" mb="2">Adress</Text>
                  <Pressable
                    borderRadius="8"
                    py="3"
                    px="1.5"
                    // alignItems="center"
                    borderColor="#ff7e1a"
                    borderWidth={1}
                    rounded="md"
                    onPress={() => setEditAddress(true)}
                  >
                    <Text>
                      {user.street}, {user.city}, {county ? county.name : "NA"}
                    </Text>
                  </Pressable>
                </VStack>
              )}

              <FormControl mb="3">
                <FormControl.Label>När vill du ha jobbet utfört?</FormControl.Label>
                <DatePicker
                  value={deadlineFrom}
                  onChange={deadLineFormHandler}
                />
                <Text marginY="3" style={{ textAlign: "center" }}>till</Text>
                <DatePicker
                  value={deadlineTo}
                  minimumDate={new Date(deadlineFrom)}
                  onChange={setDeadlineTo}
                />
              </FormControl>

              {/* <FormControl>
                <VStack>
                  <CheckBox
                    title="Låt företag svara mig"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={visibility === "public"}
                    p={0}
                    checkedColor="#ff7e1a"
                    borderRadius="8"
                    _focus={{
                      borderColor: "#ff7e1a"
                    }}
                    borderColor="#ff7e1a"
                    borderWidth={1}
                    onPress={() => setVisibility("public")}
                  />
                  <CheckBox
                    title="Välj vilka företag"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={visibility === "private"}
                    checkedColor="#ff7e1a"
                    borderRadius="8"
                    _focus={{
                      borderColor: "#ff7e1a"
                    }}
                    borderColor="#ff7e1a"
                    borderWidth={1}
                    onPress={() => setVisibility("private")}
                  />
                </VStack>
              </FormControl>

              {
                visibility === 'private'
                  ?
                  <>
                    <Pressable
                      // bg="#ff7e1a" 
                      p="3"
                      mt="2.5"
                      borderRadius="8"
                      _focus={{
                        borderColor: "#ff7e1a"
                      }}
                      borderColor="#ff7e1a"
                      borderWidth={1}
                      alignItems="center"
                      onPress={chooseCompany}>
                      <Text fontSize="md">Välj företag</Text>
                    </Pressable>
                    <View style={{ marginTop: 15 }}>
                      {Object.keys(selectedProviders).map(key => (
                        <ListItem key={key} style={{ paddingLeft: 0, paddingRight: 0 }}>
                          <Image
                            source={{ uri: selectedProviders[key].picture }}
                            style={{ width: 40, height: 40, borderRadius: 25 }} />
                          <ListItem.Content>
                            <ListItem.Title>{selectedProviders[key].name}</ListItem.Title>
                          </ListItem.Content>
                          <IconButton onPress={() => removeProvider(key)}
                            icon={<Icon as={<FontAwesome5 name="trash" />} size="20px" color="danger.500" />} />
                        </ListItem>
                      ))}
                    </View>
                  </>
                  : <></>
              } */}

              <Button
                _text={{ color: "light.200" }}
                my={5}
                rounded="md"
                p="3"
                onPress={validate}
                isLoading={loading}
                isLoadingText="Läser in..."
              >
                Skicka in
              </Button>
            </>
          )}
          {/*  <Button
            _text={{ color: "light.200" }}
            my={5}
            onPress={validate}
            isLoading={loading}
          >
            Nästa
          </Button> */}


          {/*     {pictures.length > 0 && (
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

          <Pressable
            bg="light.200"
            p={4}
            alignItems="center"
            rounded="md"
            _pressed={{ bg: "dark.700" }}
            //    onPress={choosePictures}>
            onPress={() => { Keyboard.dismiss(); onOpen() }}
          >
            <Text fontSize="md">Lägg till bilder</Text>
          </Pressable>

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

          {editAddress ? (
            <>
              <FormControl>
                <FormControl.Label>Län</FormControl.Label>
                <Select
                  value={county.name}
                  onValueChange={setCounty}
                  selectedValue={county}
                >
                  {counties.map((county) => {
                    return (
                      <Select.Item
                        label={county.name}
                        value={county}
                        key={county.code}
                      />
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Stad</FormControl.Label>
                <Select selectedValue={city} onValueChange={setCity}>
                  {county.cities.sort().map((city, i) => {
                    return <Select.Item label={city} value={city} key={i} />;
                  })}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Gatuadress</FormControl.Label>
                <Input
                  value={street}
                  onChange={setStreet}
                  autoComplete="street-address"
                />
              </FormControl>
            </>
          ) : (
            <Pressable
              bg="light.200"
              p={4}
              alignItems="center"
              rounded="md"
              _pressed={{ bg: "dark.700" }}
              onPress={() => setEditAddress(true)}
            >
              <Text>
                {user.street}, {user.city}, {county ? county.name : "NA"}
              </Text>
            </Pressable>
          )}

          <FormControl>
            <FormControl.Label>När vill du ha jobbet utfört?</FormControl.Label>
            <DatePicker value={deadlineFrom} onChange={deadLineFormHandler} />
            <Text style={{ textAlign: "center" }}>till</Text>
            <DatePicker
              value={deadlineTo}
              minimumDate={new Date(deadlineFrom)}
              onChange={setDeadlineTo}
            />
          </FormControl>

          <FormControl>
            <VStack>
              <CheckBox
                title="Låt företag svara mig"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={visibility === "public"}
                checkedColor="#000"
                onPress={() => setVisibility("public")}
              />
              <CheckBox
                title="Välj vilka företag"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={visibility === "private"}
                checkedColor="#000"
                onPress={() => setVisibility("private")}
              />
            </VStack>
          </FormControl>
          {
            visibility === 'private'
              ?
              <>
                <Pressable bg="light.200" p={4} alignItems="center" rounded="md" _pressed={{ bg: 'dark.700' }}
                  onPress={chooseCompany}>
                  <Text fontSize="md">Välj företag</Text>
                </Pressable>
                <View style={{ marginTop: 15 }}>
                  {Object.keys(selectedProviders).map(key => (
                    <ListItem key={key} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <Image
                        source={{ uri: selectedProviders[key].picture }}
                        style={{ width: 40, height: 40, borderRadius: 25 }} />
                      <ListItem.Content>
                        <ListItem.Title>{selectedProviders[key].name}</ListItem.Title>
                      </ListItem.Content>
                      <IconButton onPress={() => removeProvider(key)}
                        icon={<Icon as={<FontAwesome5 name="trash" />} size="20px" color="danger.500" />} />
                    </ListItem>
                  ))}
                </View>
                
              </>
              : <></>
          }

          <Button
            _text={{ color: "light.200" }}
            my={5}
            onPress={validate}
            isLoading={loading}
            isLoadingText="Läser in..."
          >
            Skicka in
          </Button> */}
        </VStack>
      </SafeScrollView>

    </>
  );
}
