Behave peer-to-peer CDN
==========================

Behave is an effort to build a peer-to-peer CDN, allowing users to contribute hosting and sharing of website they like, in order to increase the decentralizatation of the web.

It is designed to address one main issue of peer-to-peer content distribution: latency and responsiveness. 
To do so, it builds a _behavioural cache_ through the selection of users sharing the same interests. This selection allows nodes to only exchange within a small subset of the network, and prefetch informations likes cache indexes, giving them an immediate view of which content is available or not.

Licence: GNU AGPL (See COPYING)

Authors: 
Mathieu Goessens <mathieu.goessens@inria.fr> , <gebura@poolp.org>
Davide Frey <davide.frey@inria.fr>
Anne-Marie Kermarrec <anne-marie.kermarrec@inria.fr>
With noticeable support from various members of the ASAP team <http://irisa.fr/asap>

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

