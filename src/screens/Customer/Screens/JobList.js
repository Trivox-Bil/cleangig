import React, { useCallback, useEffect, useState } from "react";
import { cleangigApi } from "../../../network";
import { useSelector } from "react-redux";
import {
  Badge,
  Center,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
  Icon
} from "native-base";
import AppBar from "../../../components/AppBar";
import FetchContent from "../../../components/FetchContent";
import JobStatusFilter from "../../../components/JobStatusFilter";
import services from "../../../data/services";
import { FontAwesome5 } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';

const STATUS_ALL = ["pending", "initial", "assigned", "done"];
const STATUS_PENDING = ["pending"];
const STATUS_INITIAL = ["initial"];
const STATUS_ASSIGNED = ["assigned"];
const STATUS_UNPAID = ["unpaid"];
const STATUS_DONE = ["done"];

export default function ({ navigation }) {
  const user = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState(STATUS_ALL);
  const [showListId, setShowListId] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchToken, setSearchToken] = useState('');

  useEffect(() => {
    fetchProjects().then(() => {
      // setInterval(fetchProjects, 20000);
    });
  }, []);

  const filteredJobs = useCallback(() => {
    return jobs.filter((j) => statusFilter.includes(j.status));
  }, [jobs, statusFilter]);

  async function fetchProjects() {
    setLoading(true);
    const { data } = await cleangigApi.get(`customers/${user.id}/jobs`);
    let temp = {};
/*     let temp = {
      all: data.jobs,
      pending: data.jobs.filter(j => STATUS_PENDING.includes(j.status)),
      initial: data.jobs.filter(j => STATUS_INITIAL.includes(j.status)),
      assigned: data.jobs.filter(j => STATUS_ASSIGNED.includes(j.status)),
      unpaid: data.jobs.filter(j => STATUS_UNPAID.includes(j.status)),
      done: data.jobs.filter(j => STATUS_DONE.includes(j.status))
    } */
    if (searchToken.trim() === "") {
      temp = {
        all: data.jobs,
        pending: data.jobs.filter(j => STATUS_PENDING.includes(j.status)),
        initial: data.jobs.filter(j => STATUS_INITIAL.includes(j.status)),
        assigned: data.jobs.filter(j => STATUS_ASSIGNED.includes(j.status)),
        unpaid: data.jobs.filter(j => STATUS_UNPAID.includes(j.status)),
        done: data.jobs.filter(j => STATUS_DONE.includes(j.status))
      }
  } else {
      temp = {
          all: data.jobs.filter(job => job.title.includes(searchToken) || job.city.includes(searchToken) || job.street.includes(searchToken)),
          pending: data.jobs.filter(j => STATUS_PENDING.includes(j.status) && (j.title.includes(searchToken) || j.city.includes(searchToken) || j.street.includes(searchToken))),
          initial: data.jobs.filter(j => STATUS_INITIAL.includes(j.status) && (j.title.includes(searchToken) || j.city.includes(searchToken) || j.street.includes(searchToken))),
          assigned: data.jobs.filter(j => STATUS_ASSIGNED.includes(j.status) && (j.title.includes(searchToken) || j.city.includes(searchToken) || j.street.includes(searchToken))),
          unpaid: data.jobs.filter(j => STATUS_UNPAID.includes(j.status) && (j.title.includes(searchToken) || j.city.includes(searchToken) || j.street.includes(searchToken))),
          done: data.jobs.filter(j => STATUS_DONE.includes(j.status) && (j.title.includes(searchToken) || j.city.includes(searchToken) || j.street.includes(searchToken))),
      }
  }
    setJobs(temp);
    // setJobs(data.jobs);
    setLoading(false);
  }

  const filterJobs = () => {
    if (searchToken.trim() === "") {
        fetchProjects()
    } else {
        let temp = { ...jobs };
        if (temp?.all.length > 0) {
            temp.all = temp.all.filter(job => job.title.includes(searchToken) || job.city.includes(searchToken) || job.street.includes(searchToken))
        }
        if (temp?.pending.length > 0) {
            temp.pending = temp.pending.filter(job => job.title.includes(searchToken) || job.city.includes(searchToken) || job.street.includes(searchToken))
        }
        if (temp?.initial.length > 0) {
            temp.initial = temp.initial.filter(job => job.title.includes(searchToken) || job.city.includes(searchToken) || job.street.includes(searchToken))
        }
        if (temp?.assigned.length > 0) {
            temp.assigned = temp.assigned.filter(job => job.title.includes(searchToken) || job.city.includes(searchToken) || job.street.includes(searchToken))
        }
        if (temp?.unpaid.length > 0) {
            temp.unpaid = temp.unpaid.filter(job => job.title.includes(searchToken) || job.city.includes(searchToken) || job.street.includes(searchToken))
        }
        if (temp?.done.length > 0) {
            temp.done = temp.done.filter(job => job.title.includes(searchToken) || job.city.includes(searchToken) || job.street.includes(searchToken))
        }
        setJobs(temp)
    }
}

  const ListHead = (id, title) => {
    return <Pressable borderBottomWidth={1} borderColor="#ccc" onPress={() => showListId === id ? setShowListId(null) : setShowListId(id)}>
        <HStack px={2} py={4} space={2}  justifyContent="space-between">
            <Text fontWeight="bold">{title}</Text>
            {
                id === showListId 
                ? <Icon as={FontAwesome5} size="5" name="chevron-down" />
                : <Icon as={FontAwesome5} size="5" name="chevron-right" />
            }
            
        </HStack>
    </Pressable>
}

  function ListItem({ item: job }) {
    return (
      <Pressable
        _pressed={{ bg: "gray.200" }}
        onPress={() => navigation.navigate("Job", { data: job })}
        px={2}
        py={4}
        space={2}
        borderBottomWidth={1}
        borderColor="#ccc"
      >
        <HStack alignItems="center">
          <Image
            source={services.find((s) => s.id === job.service_id).icon}
            w={10}
            h={10}
            m={4}
            alt=" "
          />
          <VStack space={4}>
            <Heading size="sm">{job.title}</Heading>
            <HStack space={4}>
              <Badge>
                {job.visibility === "private" ? "Privat" : "Offentligt"}
              </Badge>
              <Badge>
                {job.status === "pending" && "Väntar Godkännande"}
                {job.status === "initial" && "Inte tilldelats"}
                {job.status === "assigned" && "Pågående"}
                {job.status === "unpaid" && "Fakturor"}
                {job.status === "done" && "Slutfört arbete"}
              </Badge>
            </HStack>
          </VStack>
        </HStack>
      </Pressable>
    );
  }

  return (
    <VStack flex={1}>
      <AppBar
        screenTitle="Jobb"
        navigation={navigation}
        customOptions={[{ action: fetchProjects, icon: "sync" }]}
      />
      <SearchBar
            placeholder="Sök"
            platform={Platform.OS}
            onChangeText={setSearchToken}
            value={searchToken}
            showLoading={searching}
            onSubmitEditing={filterJobs}
        />
      {ListHead(0, 'Allt')}
        {0 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.all}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}
      {ListHead(1, 'Väntar Godkännande')}
        {1 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.pending}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}
      {ListHead(2, 'Inte tilldelats')}
        {2 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.initial}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}
      {ListHead(3, 'Pågående')}
        {3 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.assigned}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}
      {ListHead(4, 'Fakturor')}
        {4 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.unpaid}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}
      {ListHead(5, 'Slutfört arbete')}
        {5 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.done}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}
     {/*  <VStack flex={0.2}>
        <JobStatusFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: STATUS_ALL, title: "Allt" },
            { value: STATUS_PENDING, title: "Väntar Godkännande" },
            { value: STATUS_INITIAL, title: "Inte tilldelats" },
            { value: STATUS_ASSIGNED, title: "Pågående" },
            { value: STATUS_UNPAID, title: "Fakturor" },
            { value: STATUS_DONE, title: "Slutfört arbete" },
          ]}
        />
      </VStack>
      <VStack flex={0.8} >
        <FetchContent fetch={fetchProjects}>
          <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={filteredJobs()}
            keyExtractor={(job) => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
              return (
                <Center flex={1} py={150}>
                  <Heading size="md" color="dark.300">
                    Inget att visa
                  </Heading>
                </Center>
              );
            }}
          />
        </FetchContent>
      </VStack> */}
    </VStack>
  );
}
