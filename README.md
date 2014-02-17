Behave : a Peer-to-Peer CDN
============================

Behave is an effort to build a peer-to-peer CDN, allowing users to contribute to hosting and sharing websites they like, increasing the decentralizatation of the web.

Behave is designed to address main issues of peer-to-peer content distribution: latency and responsiveness. 
To do so, Behave builds a _behavioural cache_ by selecting users who shares the same interests. This selection allows nodes to only exchange within a small subset of the network, and prefetch information such as cache indexes, giving them an immediate view of which content is available or not.

This website presents a firefox-based implementation of Behave, that leverage webRTC technologies for communication, and Mozilla XPCOM API to access internal browser state.

License: GNU AGPL (See COPYING)

Authors: 
* Mathieu Goessens <mathieu.goessens@inria.fr> , <gebura@poolp.org>
* Davide Frey <davide.frey@inria.fr>
* Anne-Marie Kermarrec <anne-marie.kermarrec@inria.fr>
* With noticeable support from various members of the ASAP team <http://irisa.fr/asap>

Status: Early design phase.
* Library:
	* Cache Access: DONE.
	* History Access: DONE
	* Bloom Filters: DONE
	* WebRTC communication: WIP
	* Requests interception: WIP
	* Clustering and similarity: TODO
* Main Code: WIP.
* Documentation: TODO

