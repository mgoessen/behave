Behave peer-to-peer CDN
==========================

Behave is an effort to build a peer-to-peer CDN, allowing users to contribute hosting and sharing of website they like, in order to increase the decentralizatation of the web.

It is designed to address one main issue of peer-to-peer content distribution: latency and responsiveness. 
To do so, it build a /behavioural cache/ through the selection of users sharing the same interests. This selection allows nodes to only exchange within a small subset of the network, and prefetch informations likes cache indexes, giving them an immediate view of which content is available or not.

Licence: GNU AGPL (See COPYING)

Authors: Mathieu Goessens, under supervision of Davide Frey and Anne-Marie Kermarrec.

Status: Early design phase.
* Cache Access: DONE.
* History Access: DONE
* Bloom Filters: DONE
* WebRTC communication: WIP
* Requests interception: WIP
* Clustering and similarity: TODO

