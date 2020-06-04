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
import { EventViewItem } from './events';

export function EventCard({
  item,
  index,
}: {
  item: EventViewItem;
  index: number;
}): JSX.Element {
  const theme = useTheme();
  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [visibleReportDialog, setVisibleReportDialog] = React.useState(false);

  return (
    <Card
      onPress={() => WebBrowser.openBrowserAsync(item.url)}
      style={{
        marginHorizontal: 10,
        marginBottom: 15,
        marginTop: index === 0 ? 15 : 0,
      }}
    >
      <Card.Title
        title={item.title}
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
      <Card.Cover source={{ uri: item.thumbnail_url }} />
      <Card.Content>
        <View style={{ marginTop: 10, flexDirection: 'column' }}>
          <Paragraph>2020/06/26（金） 18:00〜</Paragraph>
        </View>
        <View style={{ marginTop: 10, flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={24}
            color={theme.dark ? 'white' : 'black'}
          />
          <Paragraph style={{ marginLeft: 15 }}>YouTube</Paragraph>
        </View>
      </Card.Content>
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
              url: item.url,
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
    </Card>
  );
}
