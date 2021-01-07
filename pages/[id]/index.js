import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Divider, Text, Button, Skeleton } from '@chakra-ui/react';
import MultipleChoiceResponse from '../../components/MultipleChoiceResponse';
import OpenEndedResponseSingleChoice from '../../components/OpenEndedResponseSingleChoice';
import OpenEndedResponseMultipleChoice from '../../components/OpenEndedResponseMultipleChoice';

export async function getServerSideProps(context) {
    // Fetch poll from API
    const id = context.params.id;
    try {
        const response = await fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id);
        const data = await response.json();
        return { props: data };
    } catch (e) {
        console.log(e);
        return { props: {} };
    }

}

export default function Poll(poll) {
    // Router state
    const router = useRouter();
    const { id } = router.query;
    const goToResults = () => router.push(`/${id}/r`);

    // Poll state
    const [choices, setChoices] = useState([]);
    const [openEndedResponses, setOpenEndedResponses] = useState([]);
    const [openEndedResponse, setOpenEndedResponse] = useState('');

    // Submit poll response to API
    const submit = async () => {
        const data = {
            choices,
            openEndedResponses: poll.multipleChoices ? openEndedResponses : (openEndedResponse ? [openEndedResponse] : [])
        };

        try {
            await fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            goToResults();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Box as="section">
                <Heading size="md">{poll.question}</Heading>
                <Text fontSize="sm">ID: {id}</Text>
            </Box>
            {poll.openEnded ? (
                poll.multipleChoices ? (
                    <OpenEndedResponseMultipleChoice
                        items={poll.choices.map(choice => choice.text)}
                        selectedItems={openEndedResponses}
                        onSelectedItemsChange={changes => {
                            if (changes.selectedItems) {
                                setOpenEndedResponses(changes.selectedItems);
                            }
                        }}
                    />
                ) : (
                    <OpenEndedResponseSingleChoice
                        items={poll.choices.map(choice => choice.text)}
                        onSelectedItemChange={changes => {setOpenEndedResponse(changes.selectedItem)}}
                    />
                )
            ) : (
                <MultipleChoiceResponse
                    options={poll.choices}
                    choices={choices}
                    update={setChoices}
                    multipleChoice={poll.multipleChoices}
                />
            )}
            <Box as="footer" mt={4}>
                <Divider mb={4} />
                <Button onClick={submit} colorScheme="twitter">Vote</Button>
                <Button onClick={goToResults} ml={2}>Results</Button>
            </Box>
        </>
    );
}
