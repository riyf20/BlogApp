import { ActivityIndicator, ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import {AlertCircleIcon, Button, ChevronDownIcon, FormControl, 
  FormControlError, FormControlErrorIcon, FormControlErrorText, 
  Input, InputField, InputIcon, InputSlot, SearchIcon, Select, 
  SelectBackdrop, SelectContent, SelectDragIndicator, 
  SelectDragIndicatorWrapper, SelectIcon, SelectInput, 
  SelectItem, SelectPortal, SelectTrigger, Text } from '@gluestack-ui/themed';
import BlogCard from '@/components/BlogCard';
import { useAuthStore } from '@/utils/authStore';
import { userSearch } from '@/services/auth';
import CommentCard from '@/components/CommentCard';

const search = () => {

  const {token} = useAuthStore();  

  // Search query and type 
  const [search, setSearch] = useState('');
  const [searchInvalid, setSearchInvalid] = useState(false);
  const [searchBy, setSearchBy] = useState('Author');

  // Search error message
  const [searchError, setSearchError] = useState('')

  // Loading, error, and data variables
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [blogs, setBlogs] = useState<usersBlog[] | null>(null)
  const [comment, setComments] = useState<usersComment[] | null>(null)

  // If a query was made
  const [query, setQuery] = useState(false);

  const handleSearch = async () => {
    
    // Search field cannot be empty
    if (!search.trim()) {
      setSearchInvalid(true);
      setSearchError("Please enter a search query.")
      return
    }
    
    // Sets loading and query made to true
    setQuery(true);
    setIsLoading(true);

    try {
      // Calls backend using query
      const data = await userSearch(searchBy, search, token);
      

      // Uses Comment and commentcard component based on search type
      if(searchBy==='comments') {
        setBlogs(null)
        setComments(data)
      } else {
        setComments(null)
        setBlogs(data)
      }

      // If no data was returned --> no results
      if(data.length===0) {
        setBlogs(null)
        setComments(null)
      }
      setIsLoading(false)

    } catch (err:any) {
      setIsLoading(false)
      console.log("Error occured: ", err.message)
    }

   
  };
  

  return (
      <View className="flex-1 bg-dark-100">

        <View className="justify-center items-center flex-row mt-16 px-4 mb-4">
          <Text color='$white' size='2xl' className="self-center" bold={true}>Search</Text>
        </View>

        <View className="mt-4 bg-white border border-transparent rounded-xl h-full pb-[250px]">


          <FormControl className='justify-center self-center w-[94%] my-4 gap-4'>
            
            <FormControl isInvalid={searchInvalid}>
            <Input borderRadius={20}  >
              <InputSlot className='ml-4'>
                <InputIcon as={SearchIcon} />
              </InputSlot>
              <InputField 
                placeholder="Search..." 
                value={search}
                onChangeText={(text) => 
                  {
                    setSearchInvalid(false)
                    setSearchError('')
                    setSearch(text)
                  }}
              />
            </Input>
            {searchInvalid &&
                <View className='ml-4'>
                <FormControlError className='mr-20'>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        {searchError}
                    </FormControlErrorText>
                </FormControlError>
                </View>
            }
            </FormControl>

            <Select selectedValue={searchBy} onValueChange={(value) => setSearchBy(value)}>
              <SelectTrigger variant="rounded" size="md">
                <SelectInput placeholder="Search by..." />
                <SelectIcon  as={ChevronDownIcon}  style={{ marginRight: 12 }} />
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Author" value="author" />
                  <SelectItem label="Title" value="title" />
                  <SelectItem label="Body" value="body" />
                  <SelectItem label="Comments" value="comments" />
                </SelectContent>
              </SelectPortal>
            </Select>

            <Button 
              size="md" variant="solid" bg='#47a7a7' onPress={handleSearch}
            >
              <Text className="font-bold text-xl" color='$white' size='lg'>Search</Text>
            </Button>

          </FormControl>

          <View>
            <ScrollView
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{
                minHeight: '100%',
              }}
              className='pb-[250px]'
              >

                <View className="bg-white border border-transparent rounded-xl h-full">
                
                  {isLoading ? (
                    <>
                      <ActivityIndicator size="large" color="#008B8B" className="mt-52"/>
                      <View className="justify-center items-center mt-12">
                        <Text className="text-2xl text-secondary mb-3 px-5">
                          Searching content
                        </Text>
                      </View>
                    </>
                  ) : error ? (
                    <>
                      <View className="justify-center items-center mt-12">
                        <Text color='$red' size='xl' className="mb-3 px-5">
                          Error Occured!
                        </Text>
                        <Text color='$red' size='xl' className="mb-3 px-5">
                          Error: {error}
                        </Text>
                        
                      </View>
                    </>
                  ) : (
                    <>
                      {blogs ?
                        <>
                          {blogs?.map((item:Blog, index) => (
                            <BlogCard key={item.id} {...item} index={index} edit={false}/>
                          ))}
                        </> 
                      : comment ?
                          <>
                          {comment?.map((comment:usersComment, index) => (
                            <CommentCard key={comment.id} {...comment} index={index} edit={false}/>
                          ))}
                          </> 
                          : 
                          <>
                            {
                              query &&
                                (<View className='justify-center items-center mt-6'>
                                  <Text bold={true}>No Search Results Found</Text>
                                </View>)
                            }
                          </>
                      }
                    </>
                  )}
      
                </View>

              </ScrollView>
            </View>
            
          
        </View>
      </View>
  )
}

export default search