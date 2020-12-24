import React, { useState } from 'react';
import {
    Box,
    Wrap,
    WrapItem,
    Input,
    Tag,
    TagLabel,
    TagCloseButton,
    Text
} from '@chakra-ui/react';

export default function OpenEndedResponse(props) {
    const [responseField, setResponseField] = useState('');

    const addResponse = e => {
        if (e.key === 'Enter') {
            props.update(prev => [...prev, responseField]);
            setResponseField('');
        }
    }

    const removeResponse = toRemove => {
        props.update(prev => prev.filter(item => item !== toRemove));
    }

    const updateResponse = text => {
        setResponseField(text);
        props.update([text]);
    }

    return (
        <Box as="section" mt={10} mb={6}>
            {props.multipleChoice ? (
                <>
                    <Input
                        value={responseField}
                        onChange={e => setResponseField(e.target.value)}
                        onKeyDown={e => addResponse(e)}
                        size="lg"
                        placeholder="Type your answer"
                    />
                    <Text fontSize="sm" color="grey" mt={2}>Press enter to add multiple responses</Text>
                    <Wrap mt={7}>
                        {props.responses.map((response, i) => (
                            <WrapItem key={i}>
                                <Tag size="lg">
                                    <TagLabel fontSize="sm" lineHeight="1.5">{response}</TagLabel>
                                    <TagCloseButton onClick={() => removeResponse(response)} />
                                </Tag>
                            </WrapItem>
                        ))}
                    </Wrap>
                </>
            ) : (
                <Input
                    value={responseField}
                    onChange={e => updateResponse(e.target.value)}
                    size="lg"
                    placeholder="Type your answer"
                />
            )}
        </Box>
    );
}
