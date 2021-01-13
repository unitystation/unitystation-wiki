## Guide to electricity
Relevent guides: [Construction](Construction.md) , [Nuclear Reactor](Guide-to-the-nuclear-reactor.md)

Note: This is not a guide to the operation of the nuclear reactor or building electrical equipment, that is linked directly above.

## Overview
Electricty in US is a system that appears very complex on the surface, but is in reality very simple to understand. This guide will cover safety, electricty consuming devices, types of wires, 
APCs (not the armoured vehicles), department/local batterys, transformers, station power storage, and simple generators as well as how to sabatoge and repair the electrical grid.

## How not to become a lighbulb
As in real life, high voltages and large amounts of power are dangerous, and can very easily kill you if not respected. To remain safe while fixing or destroying the power grid, there
are several things you can do. The most potent and capable defense against electrical shocks is insulated gloves, which are able to block almost all form of electrical shocks, the budget
variety offer some protection aswell, but nowhere near the gaurenteed protection of the engineering grade ones. Cutting and merging powered wires without gloves will almost always
result in shocks that deal large amounts of burn damage, scaling with the power involved, which can easily kill you. if you don not have access to gloves, you can try to shut down power
to the wires to safely connect/cut them by interacting with power controllers, such as the APC, department battery, or station power source.

## Power Consuming Devices
Most devices on the station, from consoles to the bar dispenser all require a constant supply of power to function. If the power supply collapses or the demand for power exceeds generated pwoer,
these devices will stop working, effectively halting the station. All lightbulbs require power, and not powering the lights is a sure fire way to invoke the broken window effect. Cloning will
also not function without power, meaning dead bodies will pile up and not be revived.

## Types of Wires
Rather than a single type of wire, the stations power supply is made of a network of many types of wires. Low voltage wires are cheap, but can only handle smaller amounts of power.
Medium power wires are the most common type of wire, and are used in [hacking]() doors. High voltage wires are the rarest type of wires, and can handle the enormous loads made by
nuclear reactors and generators, they act as the spine upon which the rest of the stations grid is built.

## Area Power Controllers (APCs)
These devices (most of them) recive power from their local APC. APCs can be found just about everywhere, and typically control the power distribution of a single room. If an APC is reciving power, 
it will automatically distribute it to other devices. Devices not powered by an APC can instead be powered by a physical wire connection to a power supply. APCs themselves are connected by low voltage wires
to department batteries. If clicked on, they will open a menu, on which you can read various statistics about the APC.

## Department Batteries
Department batteries, as the name implies, control the power distribution of power to larger department sized areas. They do not power machines themselves, instead, they connect
to APCs which distribute power for them. Department batterys are connected by Medium voltage wires all the way back to the engineering department, where they are connected
to SMES devices. Batteries can be turned on and off by clicking on them.

## SMES devices
SMES devices are effectively just upscaled department batteries. They distribute power to department batteries through medium voltage wires. They recive their power from 
Transformers, to which they are connected by medium voltage wires. When clicked on they open a menu from which how much power they store and how much they distribute per tick can
be altered.

## Transformers 
Transformers are really simple, in effect, they are just a way of linking high voltage wires with medium voltage wires. they do not have a menu when clicked on and cannot be turned on or off.
They serve an important role in allowing the stations power source to connect to SMES devices which distribute the power it generates.

## Simple generators
Unlike the reactor, generators are incredibly simple. they produce a large amount of electricity by burning solid plasma, but require a constant supply to function. plasma can be
inserted into generators by clicking the generator with plasma in hand. generators can then be turned on by clicking them. The amount of power produced by generators is so large
that not even insulated gloves, or even the captains gloves, will protect you when cutting directly connected wires, they can and will kill you instantly. if you need to change
the wiring, turn the generator off first.

## Diagnostics and repair
All too often electrical devices may find themselves unpowered due to issues in the gird. Fortunately, there is an easy step by step guide that can be used to fix almost any electrical
issue.

0: if the station is unpowered, skip to step 3. if a department is unpowered, skip to step 2. otherwise move to step 1.

1: Check the APC for the room the device is in. If it is reciving power, your device is simply not connected. try moving it. occasionally a devices power requirements may
exceed what an APC can provide, in which case, you should manually link it using medium voltage wires to the stations medium voltage wire grid. if the APC is not reciving power, move to step two

2: Follow the APC's low voltage wireing to the department battery. on the way, check for any breaks in the wires. cut wires, obviously, will not transmit power. Mice will often nibble
at power cables, so killing mice in maint is reccomended. If the connection to the battery is broken, repair it and check the apc. if the APC is powered but the device isnt, move back to
step one. If the APC is still not reciving power, Move to check the department battery. if it is off, turn it on. check if the battery is distributing stored power, or if it is actually
reciving power. If it is the prior, move on to step three, if the device still isnt working, return to step one.

3: Either badger an engineer to check power, or do so yourself. engineering is restricted to non-engineers, so it is often best simply letting one fix the problem for you. to fix the issue of the battery
not being supplied, follow its medium voltage wires to the SMESs. repair any breaks. if there were breaks and you repaired them, check if the battery is reciving power or the device works
if the prior is false, repeat step two, if the latter is false move to step one. If the connection is solid, check the SMESs themselves and see if they are reciving and distributing power
If the SMESs are not reciving power, move onto step 4, if they are not distributing it, fix it and move to step one.

4:Follow the connection to the reactor/generator. Make sure there is a transformer making the power wires transition from medium to high, and that there are no breaks.
If there are breaks, fix them, and return to step 3. If there are no breaks and power is still not distributed, check to see if the generator/reactor is operating, if it isnt,
fix it. if power is still not distributed, return to step three.

## power sabatoge
The stations power supply is remarkably fragile, and a single man with access to maintenence and a wirecutter can easily cripple multiple departments. Low voltage wires to APCs can
be cut to disrupt single rooms, and while not very crippling are rarely fixed. Medium wires and batteries supply entire departments, and if broken or cut can stop it from functioning.
Finally, Destroying the generator, SMESs, cutting SMES wires, or cutting generator-transformer wires can all cut power to the entire station.
