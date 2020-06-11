import React from 'react';
import { View, Share } from 'react-native';
import {
  useTheme,
  Card,
  Paragraph,
  IconButton,
  Menu,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Analytics from '../../lib/analytics';
import * as WebBrowser from 'expo-web-browser';
import { FeedItem } from './types';

function Header({ title }: { title: string }): JSX.Element {
  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [visibleReportDialog, setVisibleReportDialog] = React.useState(false);

  return (
    <>
      <Card.Title
        title={title}
        subtitle=""
        right={() => (
          <Menu
            visible={visibleMenu}
            onDismiss={() => setVisibleMenu(false)}
            anchor={
              <IconButton
                icon="menu-down"
                onPress={() => setVisibleMenu(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => setVisibleReportDialog(true)}
              title="report"
            />
          </Menu>
        )}
      />
      <Portal>
        <Dialog visible={visibleReportDialog} dismissable={false}>
          <Dialog.Content>
            <Paragraph>TODO: content report</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleReportDialog(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const Bottom = ({
  url,
  item,
}: {
  url: string;
  item: { id: string; title: string };
}): JSX.Element => (
  <>
    <Card.Actions style={{ justifyContent: 'flex-start' }}>
      <IconButton
        icon="bookmark-outline"
        onPress={() => {
          const i: Analytics.Item = {
            item_id: item.id,
            item_name: item.title,
            item_category: 'event',
          };

          // TODO(k2wanko): Implment save stock
          const stocked = false;
          if (!stocked) {
            Analytics.logEvent('add_to_stock', {
              items: [i],
            });
          } else {
            Analytics.logEvent('remove_from_stock', {
              items: [i],
            });
          }
        }}
      />
      <IconButton
        icon="share-variant"
        onPress={() =>
          Share.share({
            url,
          }).then((resulut) => {
            if (resulut.action === 'sharedAction') {
              return Analytics.logEvent('share', {
                content_type: 'event',
                item_id: item.id,
                method: resulut.activityType ?? 'unknown',
              });
            }
          })
        }
      />
    </Card.Actions>
  </>
);

export function EventCard({
  item,
  index,
}: {
  item: FeedItem;
  index: number;
}): JSX.Element {
  const theme = useTheme();

  // Processing when link is connpass.
  const part = item.content.split('<br />');
  const startEnd = part[0];
  const place = part[1].substring('開催場所: '.length);

  return (
    <Card
      onPress={() => WebBrowser.openBrowserAsync(item.link)}
      style={{
        marginHorizontal: 10,
        marginBottom: 15,
        marginTop: index === 0 ? 15 : 0,
      }}
    >
      <Header title={item.title} />
      <Card.Cover source={{ uri: item.thumbnail }} />
      <Card.Content>
        <View style={{ marginTop: 10, flexDirection: 'column' }}>
          <Paragraph>{startEnd}</Paragraph>
        </View>
        <View style={{ marginTop: 10, flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={24}
            color={theme.dark ? 'white' : 'black'}
          />
          <Paragraph style={{ marginLeft: 15 }}>{place}</Paragraph>
        </View>
      </Card.Content>
      <Bottom url={item.link} item={{ id: item.id, title: item.title }} />
    </Card>
  );
}

export const BlogCard = ({
  item,
  index,
}: {
  item: FeedItem;
  index: number;
}): JSX.Element => (
  <Card
    style={{
      marginHorizontal: 10,
      marginBottom: 15,
      marginTop: index === 0 ? 15 : 0,
    }}
    onPress={() => WebBrowser.openBrowserAsync(item.link)}
  >
    <Header title="" />
    <Card.Cover
      source={{
        uri: item.thumbnail ? item.thumbnail : 'https://picsum.photos/700',
      }}
    />

    <Card.Content>
      <View style={{ marginTop: 10, flexDirection: 'column' }}>
        <Paragraph style={{ fontWeight: 'bold' }}>{item.title}</Paragraph>
      </View>
      {/* <View style={{ marginTop: 10, flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name="note"
            size={24}
            color={theme.dark ? 'white' : 'black'}
          />
          <Paragraph style={{ marginLeft: 15 }}>YouTube</Paragraph>
        </View> */}
    </Card.Content>

    <Bottom url={item.link} item={{ id: item.id, title: item.title }} />
  </Card>
);
