import { useContext, useEffect, useRef } from "react";
import { useDeep, useDeepId, useDeepSubscription, } from '@deep-foundation/deeplinks/imports/client';
import { Link, MinilinksResult, useMinilinksSubscription } from "@deep-foundation/deeplinks/imports/minilinks";
import { PeerContext } from '../components/ProviderPeer'


export const useListenLink = (linkId: number) => {
    const deep = useDeep();
    const peer = useRef();
    const peerContext = useContext(PeerContext);

    const createListenLink = async (): Promise<any> => {

        const listenerLinkTypeId = await deep.id("@l4legenda/peer-webrtc", "Listener");

        const r = await deep.insert({
            type_id: listenerLinkTypeId,
            from_id: peerContext.peerLinkId,
            to_id: linkId,
        })
    }

    useEffect(() => {
        if (!peerContext.peer) return
        peerContext.peer.on('connection', function (conn: any) {
            conn.on('data', function (data: any) {
                console.log("data", data, conn);
                deep.minilinks.apply([data])
            });
        });

    }, [peerContext.peer])

    useEffect(() => {
        (async () => {
            if (!peerContext.peerLinkId) return
            await createListenLink();

        })()
    }, [peerContext.peerLinkId])

}

export const useSendLink = (linkId: number) => {
    const deep = useDeep();
    const { data: peerTypeLinkId } = useDeepId("@l4legenda/peer-webrtc", "Peer")
    const { data: listenerTypeLinkId } = useDeepId("@l4legenda/peer-webrtc", "Listener")

    const peerContext = useContext(PeerContext);

    useDeepSubscription({
        _or: [
            {
                type_id: {
                    _id: ["@l4legenda/peer-webrtc", "Peer"]
                },
                out: {
                    type_id: {
                        _id: ["@l4legenda/peer-webrtc", "Listener"]
                    },
                    to_id: linkId,
                },
            },
            {
                type_id: {
                    _id: ["@l4legenda/peer-webrtc", "Listener"]
                },
                to_id: linkId,
            }
        ]
    })

    const queryPeer = deep.minilinks.query({
        type_id: peerTypeLinkId || 0,
        out: {
            type_id: listenerTypeLinkId || 0,
            to_id: linkId,
        }
    })

    useEffect(() => {
        const sendLink = (link: Link<number>) => {

            console.log("queryPeer", queryPeer);
            console.log(peerContext.peer);
            for (const peerLink of queryPeer) {
                const value = peerLink.value?.value;

                const conn = peerContext.peer.connect(value)
                console.log("connected " + value)
                conn.on('open', function () {
                    conn.send({
                        id: link.id,
                        from_id: link.from_id,
                        to_id: link.to_id,
                        value: link.value,
                        type_id: link.type_id,
                    })
                });

            }
        }

        const addedEvent = (oldLink: Link<number>, newLink: Link<number>) => {
            if (newLink.id !== linkId) return;
            console.log("added", newLink)
            sendLink(newLink)
        }
        const updatedEvent = (oldLink: Link<number>, newLink: Link<number>) => {
            if (newLink.id !== linkId) return;
            console.log("updated", newLink)
            sendLink(newLink)
        }
        deep.minilinks.emitter.on('added', addedEvent);
        deep.minilinks.emitter.on('updated', updatedEvent);
        return () => {
            deep.minilinks.emitter.removeListener('added', addedEvent);
            deep.minilinks.emitter.removeListener('updated', updatedEvent);
        }
    }, [peerTypeLinkId, listenerTypeLinkId, peerContext, queryPeer])

}
