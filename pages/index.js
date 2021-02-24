import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaQuestionCircle } from 'react-icons/fa';
import { Box, Stack, Flex, Input, Checkbox, Button, Switch, Text, Tooltip, Spinner } from '@chakra-ui/react';
import { HomepageAnimateOpen } from '../components';
import { createWarningToast, createNetworkErrorToast } from '../utils';
import SplashLayout from '../layouts/SplashLayout';
import createPollRequest from '../api/createPoll';

const HelpTooltip = () => (
    <Tooltip
        hasArrow
        bg="gray.300"
        color="black"
        placement="right"
        offset={[0,16]}
        pl={3}
        py={2}
        label="Users enter their own answers to the question and matching responses get counted together."
    >
        <Box ml={2}><FaQuestionCircle /></Box>
    </Tooltip>
);

const validateFields = ({ question, openEnded, answers }) => {
    // Validate question
    if (question === '') {
        createWarningToast('Please enter a question.');
        return false;
    }

    // Validate answer fields
    if (!openEnded && answers.length < 2) {
        createWarningToast('Please provide at least 2 answer choices.');
        return false;
    }

    return true;
}

export default function Home() {
    // Router state
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '']);
    const [openEnded, setOpenEnded] = useState(false);
    const [multipleChoices, setMultipleChoices] = useState(false);

    // Submit newly created poll to API
    const submit = async () => {
        // Trim whitespace and filter empty answers
        const filteredAnswers = answers.map(answer => answer.trim()).filter(answer => answer !== '');

        const newPoll = {
            question,
            answers: !openEnded ? filteredAnswers : [],
            openEnded,
            multipleChoices
        };

        // Validate form fields
        if (!validateFields(newPoll)) {
            return;
        }

        try {
            // Submit data
            setIsSubmitting(true);
            const data = await createPollRequest(newPoll);
            router.push('/' + data.id);
        } catch (e) {
            // Handle errors
            console.log(e);
            createNetworkErrorToast(e);
            setIsSubmitting(false);
        }
    }

    // Append a new answer field
    const addAnswerField = () => setAnswers(arr => [...arr, '']);

    // Modify an existing answer field
    const updateAnswerField = (i, newValue) => {
        const updatedAnswers = [...answers];
        updatedAnswers[i] = newValue;
        setAnswers(updatedAnswers);

        // Add new field if typing into the last one
        if (i === answers.length - 1) {
            addAnswerField();
        }
    }

    return (
        <SplashLayout>
            <Head>
                <title>Splashpoll.app | Instantly create open-ended online polls</title>
                <meta name="description" content="The easiest way to create free, real-time online polls. Create multiple choice polls or use our unique open-ended response mode." />
                <link rel="canonical" href="https://splashpoll.app/" />
            </Head>
            <Box as="section">
                <Input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    variant="flushed"
                    placeholder="What's your question?"
                />
            </Box>
            <Box as="section" mt={8}>
                <Flex align="center" width="fit-content">
                    <Switch
                        id="open-ended"
                        isChecked={openEnded}
                        onChange={() => setOpenEnded(b => !b)}
                        mr={3}
                    />
                    <Text fontWeight="semibold" as="label" htmlFor="open-ended">Open response mode</Text>
                    <HelpTooltip />
                </Flex>
                <Flex align="center" mt={5}>
                    <Switch
                        id="multiple-choice"
                        isChecked={!openEnded}
                        onChange={() => setOpenEnded(b => !b)}
                        mr={3}
                    />
                    <Text fontWeight="semibold" as="label" htmlFor="multiple-choice">Fixed choice mode</Text>
                </Flex>
            </Box>
            <HomepageAnimateOpen isOpen={!openEnded}>
                <Stack spacing={3}>
                    {answers.map((answer, i) => (
                        <Input
                            key={i}
                            value={answer}
                            onChange={e => updateAnswerField(i, e.target.value)}
                            variant="flushed"
                            placeholder="Enter answer"
                        />
                    ))}
                </Stack>
            </HomepageAnimateOpen>
            <Box as="section">
                <Stack direction="column">
                    <Checkbox
                        value={multipleChoices}
                        onChange={() => setMultipleChoices(b => !b)}
                        size="sm"
                    >
                        Allow multiple poll answers
                    </Checkbox>
                </Stack>
            </Box>
            <Flex as="footer" align="center" mt={5}>
                <Button onClick={submit} colorScheme="twitter">Create Poll</Button>
                {isSubmitting && <Spinner ml={6} />}
            </Flex>
        </SplashLayout>
    );
}
